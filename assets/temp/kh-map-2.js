var waypoints = {
	"currentWaypoint" : "",
	"origin" :  {
						"city" : "Seattle",
						"state" : "WA",
						"lattitude" : 47.620921,
						"longitude" : -122.349266
	},
	"waypoint1" : {
						"city" : "Portland",
						"state" : "OR",
						"lattitude" : 45.5425913,
						"longitude" : -122.7945059
	},
	"waypoint2" : { 
						"city" : "Sacramento",
						"state" : "CA",
						"lattitude" : 38.5617256,
						"longitude" : -121.5829973
	},
	"waypoint3" : { 
						"city" : "Denver",
						"state" : "C0",
						"lattitude" : 39.7645187,
						"longitude" : -104.9951961
	},
	"waypoint4" : { 
						"city" : "Chicago",
						"state" : "IL",
						"lattitude" : 41.8987739,
						"longitude" : -87.6251055
	},
	"waypoint5" : { 
						"city" : "Independence",
						"state" : "MO",
						"lattitude" : 39.1185682,
						"longitude" : -94.4713356
	},
	"waypoint6" : { 
						"city" : "Atlanta",
						"state" : "GA",
						"lattitude" : 33.7348124,
						"longitude" : -84.3921616
	},
	"destination" : { 
						"city" : "Orlando",
						"state" : "FL",		
						"lattitude" : 28.3714667,
						"longitude" : -81.5502655
	}
}
// Declare these globally so we can reuse map
var directionsService = new google.maps.DirectionsService;
var directionsDisplay = new google.maps.DirectionsRenderer;

var waypointsArray = [];

function initialize() {	
	// Define map properties
	var mapUSAProperties = {
		center:new google.maps.LatLng(40.2617571,-94.8282592),
		zoom:4,
		mapTypeId:google.maps.MapTypeId.ROADMAP
	};
	// Create a new map object
	var mapUSA=new google.maps.Map(document.getElementById("USAMap"),mapUSAProperties);
	// Call the Marker constructor to create a marker
	var marker=new google.maps.Marker({
		position: {lat: waypoints["origin"].lattitude, lng: waypoints["origin"].longitude},
		title: 'Click here to start',
	});
	//Add the marker to the map
	marker.setMap(mapUSA);
	// Create an info window to display a text bubble on the map
	var infoWindow = new google.maps.InfoWindow({
		content: "Click here to start!"
	});
	// Add the info windo to the map
	infoWindow.open(mapUSA, marker);

	// Add an onclick listener
	google.maps.event.addListener(marker, 'click',function() {
		var queryURL = "https://crossorigin.me/http://www.opentdb.com/api.php?amount=1&category=22&difficulty=hard&type=multiple";
		console.log(queryURL);
		$.ajax({
			url: queryURL,
			method: 'GET'
		})
		.done(function(response) {
			// call display question, pass response
			randomQuestion(response);
		})
		// Hid the map and display the triviaPanel
		$('#USAMap').hide();
		$('#triviaPanel').show();
	});		
	directionsDisplay.setMap(mapUSA);
}; // end intialize

// Calls the intialize function on window load
google.maps.event.addDomListener(window, 'load', initialize);


function randomQuestion(response) {
	console.log("response:", response);

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
		 				// If correct show map with next waypoint plotted
		 				//show map with next waypoint
						if (index==correctAnswerIndex) {
							// TODO: Update currentWaypoint	
							updateCurrentWaypoint();						
							nextWaypoint();
							console.log("You got the answer right, move on the the next waypoint!");
							
	                	} else {
	                		// Display something about incorrect
	                		console.log("Bummer, you answered wrong, looks like you're stuck!"); 
	                	}

		 			})
	 			);
	 	
	 	// Append it to the element
	 	$displayAnswers.append($answer);
	});		
};

function updateCurrentWaypoint() {
	// get current waypoint
	console.log("waypoints.currentWaypoint");
	
	// set next waypoint

	waypointsArray.push({location : {lat: waypoints["waypoint1"].lattitude, lng: waypoints["waypoint1"].longitude}});

}

function nextWaypoint() {
	

	$('#triviaPanel').hide();
	$('#USAMap').show();

	directionsService.route({
		origin: {lat: waypoints["origin"].lattitude, lng: waypoints["origin"].longitude},
		destination: {lat: waypoints["waypoint2"].lattitude, lng: waypoints["waypoint2"].longitude},
		// waypoints: [{location : {lat: waypoints["waypoint1"].lattitude, lng: waypoints["waypoint1"].longitude}}],
		waypoints: waypointsArray,
		optimizeWaypoints: true,                    
		travelMode: google.maps.DirectionsTravelMode.DRIVING
	}, function(response, status) {
		if (status === 'OK') {
			directionsDisplay.setDirections(response);
			
		} else {
			window.alert('Directions request failed due to ' + status);
		}
	});
}
//