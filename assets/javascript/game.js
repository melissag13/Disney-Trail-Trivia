var waypoints = [
	{	"city" : "Seattle",
		"state" : "WA",
		"lattitude" : 47.620921,
		"longitude" : -122.349266
	},
	{	"city" : "Portland",
		"state" : "OR",
		"lattitude" : 45.5425913,
		"longitude" : -122.7945059
	},
	{	"city" : "Sacramento",
		"state" : "CA",
		"lattitude" : 38.5617256,
		"longitude" : -121.5829973
	},
	{ 	"city" : "Denver",
		"state" : "C0",
		"lattitude" : 39.7645187,
		"longitude" : -104.9951961
	},	
	{ 	"city" : "Independence",
		"state" : "MO",
		"lattitude" : 39.1185682,
		"longitude" : -94.4713356
	},
	{ 	"city" : "Chicago",
		"state" : "IL",
		"lattitude" : 41.8987739,
		"longitude" : -87.6251055
	},
	{ 	"city" : "Atlanta",
		"state" : "GA",
		"lattitude" : 33.7348124,
		"longitude" : -84.3921616
	},
	{ 	"city" : "Orlando",
		"state" : "FL",		
		"lattitude" : 28.3714667,
		"longitude" : -81.5502655
	}
]
// Arrays to randomly pull correct and incorrect messages from
var correctMessages = [ "That was a quick pitstop, let's get back on the road!",
						"Sun is shining, gas tank is full, kids are buckled in, let's get moving!",
						"Phew, that cop wasn't looking our way, guess maybe we should stick to the speed limit",
						"Keep this up and we'll be there in no time!",
						"The kids are asleep, let's make up for lost time.",
						"Good thing we were able to avoid that construction, thank goodness they had warning signs."
					  ];
var incorrectMessages = ["Oh no, you ran out of gas! Looks like we'll be here awhile.",
						 "Flat tire, where's the spare?",
						 "I thought the sign said 70 officer!  Guess we won't be going anywhere for awhile.",
						 "Headlight out, going to have to stop at the parts store, bummer!",
						 "Did the detour sign say to turn left or right? Guess we're lost now!",
						 "Ugh!  Why is there so much construction, this is not moving!",
						 "You were speeding and got a ticket, better watch out for the signs!",
						 "Your car insurance expired. Please renew it ASAP.",
						 "You got locked out, please call AAA or contact your rental car company for help.",
						 "Such a bad day!! Your car is broken down and you lost your wallet.",
						 "You almost got hit by lightning!! Park your car and get into a safe place.",
						 "Lost your phone at that last gas station. Go back to find it."
						];
// Global variables to keep track of current waypoint index
currentWaypointIndex = 0;
// Declare these globally so we can reuse map
var directionsService = new google.maps.DirectionsService;
var directionsDisplay = new google.maps.DirectionsRenderer;
// Global for now
var mapUSA;

var waypointsArray = [];

function initialize() {	
	$('.full').fireworks();
	// Define map properties
	var mapUSAProperties = {
		center:new google.maps.LatLng(39.1119932,-95.1798217),
		zoom:4,
		mapTypeId:google.maps.MapTypeId.ROADMAP,
		disableDefaultUI: true
	};
	// Create a new map object
	mapUSA=new google.maps.Map(document.getElementById("USAMap"),mapUSAProperties);
	// Call the Marker constructor to create a marker
	var marker=new google.maps.Marker({
		position: {lat: waypoints[0].lattitude, lng: waypoints[0].longitude},
		icon:'assets/images/car-icon.png',
		title: 'Click here to start',
	});
	//Add the marker to the map
	marker.setMap(mapUSA);
	
	// Add an onclick listener
	google.maps.event.addListener(marker, 'click',function() {
		// Toggle display divs
		$('.questionPanel').toggle(true);
		$('.messagePanel').toggle(false);
		$('.click-start-div').hide();		

		var queryURL = "https://crossorigin.me/http://www.opentdb.com/api.php?amount=1&difficulty=easy&type=multiple";
		console.log(queryURL);
		$.ajax({
			url: queryURL,
			method: 'GET'
		})
		.done(function(response) {
			// call display question, pass response
			randomQuestion(response);			
		})
	});		
	directionsDisplay.setMap(mapUSA);

	// $('#messageDiv').html("Welcome to Disney Trail! <br /> Click the car icon on the map to start.");
}; // end intialize

// Calls the intialize function on window load
google.maps.event.addDomListener(window, 'load', initialize);

/* ************************************************************	*/
/* Function : randomQuestion									*/
/* Parameters : response										*/
/* Description : This function 									*/
/* ************************************************************	*/
function randomQuestion(response) {
	// Toggle display panels
	$('.questionPanel').show();
	$('.messagePanel').hide();
	$('#btnContinue').hide();
	$('.click-start-div').hide();
	// Variables to build jquery objects for display
	var $displayAnswers = $('#displayAnswers');
	var $questionDiv = $('#displayQuestion');

	// Empty answer list
	$displayAnswers.empty();	

	// Question from JSON object
	var question = response.results[0].question;
	// Array of incorrect answers from JSON object
	var choices = [response.results[0].incorrect_answers[0], response.results[0].incorrect_answers[1], response.results[0].incorrect_answers[2]];
	// Random index value created
	var correctAnswerIndex = Math.floor((Math.random() * 3));
	console.log("correct", correctAnswerIndex);
	// Splice the correct answer into the choices array in a random location
	choices.splice(correctAnswerIndex, 0, response.results[0].correct_answer); 

	// Set the questionDiv to the question
	$questionDiv.html(question);	
	// Display answers
	$.each(choices, function( index, value) {			
		// Create jquery object		
	 	var $answer = ($('<button/>')
		 		.attr("type", "button")
		 		.html(value)
		 		.addClass("list-group-item")		 		
		 		// On click function for the button
		 		.on('click', function() {	
		 				// Toggle question and message panel display
		 				$('.questionPanel').hide();
						$('.messagePanel').show();
						$('#btnContinue').show();
						$('.click-start-div').hide();
		 				// If correct show map with next waypoint plotted
		 				// and show congrats message
						if (index==correctAnswerIndex) {							
							updateCurrentWaypoint();						
							nextWaypoint();
							$('.messageDiv').html(correctMessages[Math.floor((Math.random() * correctMessages.length))])
											.removeClass("incorrect-answer")
											.addClass("correct-answer");
	                	} else {
	                		// Answer was incorrect, show bummer message, map does not move
	                		$('.messageDiv').html(incorrectMessages[Math.floor((Math.random() * incorrectMessages.length))])
	                						.removeClass("correct-answer")
	                						.addClass("incorrect-answer");
	                	}
		 			})
	 			);	 	
	 	// Append it to the element
	 	$displayAnswers.append($answer);
	});		
};

function updateCurrentWaypoint() {
	// Update current waypoint index
	currentWaypointIndex++;	
	// set next waypoint in array
	waypointsArray.push({location : {lat: waypoints[currentWaypointIndex].lattitude,
									 lng: waypoints[currentWaypointIndex].longitude}});
	
}

function nextWaypoint() {	
	directionsService.route({
		origin: {lat: waypoints[0].lattitude, lng: waypoints[0].longitude},
		destination: {lat: waypoints[currentWaypointIndex].lattitude, 
					  lng: waypoints[currentWaypointIndex].longitude},		
		waypoints: waypointsArray,
		optimizeWaypoints: false,                    
		travelMode: google.maps.DirectionsTravelMode.DRIVING
	}, function(response, status) {
		if (status === 'OK') {
			directionsDisplay.setDirections(response);
			// Supress normal waypoint markers so the car icon shows
			directionsDisplay.setOptions( { suppressMarkers: true } );
			// Add current destination marker to add onclick to
			var currentDestinationMarker=new google.maps.Marker({
				position: {lat: waypoints[currentWaypointIndex].lattitude, 
						   lng: waypoints[currentWaypointIndex].longitude},
				icon:'assets/images/car-icon.png'
			});
			//Add the marker to the map
			currentDestinationMarker.setMap(mapUSA);
			
		} else {
			window.alert('Directions request failed due to ' + status);
		}
	});

}

$('#btnContinue').on('click', function() {
	var queryURL = "https://crossorigin.me/http://www.opentdb.com/api.php?amount=1&difficulty=easy&type=multiple";
	console.log(queryURL);
	$.ajax({
		url: queryURL,
		method: 'GET'
	})
	.done(function(response) {
		// call display question, pass response
		randomQuestion(response);
	})
});



$("#instructions-icon").on('click', function(){
	$(".instructions").toggle();
})