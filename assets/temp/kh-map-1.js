var waypoints = {
	"waypoint1" :  {
						"city" : "Seattle",
						"state" : "WA",
						"lattitude" : 47.620921,
						"longitude" : -122.349266
	},
	"waypoint2" : {
						"lattitude" : 45.5425913,
						"longitude" : -122.7945059
	},
	"waypoint3" : {
						"lattitude" : 38.5617256,
						"longitude" : -121.5829973
	},
	"waypoint4" : {
						"lattitude" : 39.5581117,
						"longitude" : -119.9909261
	},
	"waypoint5" : {
						"lattitude" : 40.7767833,
						"longitude" : -112.0605696
	},
	"waypoint6" : {
						"lattitude" : 39.7645187,
						"longitude" : -104.9951961
	},
	"waypoint7" : {
						"lattitude" : 41.2920321,
						"longitude" : -96.221333
	},
}


// var seattleMarker = new google.maps.LatLng(47.620921,-122.349266);

var seattleMarker = new google.maps.LatLng(waypoints["waypoint1"].lattitude,
										   waypoints["waypoint1"].longitude);

//var directionsService = new google.maps.DirectionsService();
//var directionDisplay;

var directionsService = new google.maps.DirectionsService;
	var directionsDisplay = new google.maps.DirectionsRenderer;


function initialize() {
	// var directionsService = new google.maps.DirectionsService;
	// var directionsDisplay = new google.maps.DirectionsRenderer;

	directionsDisplay.setMap(mapUSA);

	var mapUSAProperties = {
		center:new google.maps.LatLng(40.2617571,-94.8282592),
		zoom:4,
		mapTypeId:google.maps.MapTypeId.ROADMAP
	};

	var mapUSA=new google.maps.Map(document.getElementById("USAMap"),mapUSAProperties);

	var marker=new google.maps.Marker({
			position: seattleMarker,
			title: 'Click here to start',
	});

	marker.setMap(mapUSA);

	var infoWindow = new google.maps.InfoWindow({
		content: "Click here to start!"
	});
	
	infoWindow.open(mapUSA, marker);


	google.maps.event.addListener(marker, 'click',function() {
		var queryURL = "https://crossorigin.me/http://www.opentdb.com/api.php?amount=1&category=22&difficulty=hard&type=multiple";
		console.log(queryURL);
		$.ajax({
			url: queryURL,
			method: 'GET'
		})
		.done(function(response) {
			console.log(response);
			// call display question, pass response
			randomQuestion(response);
		})

		$('#USAMap').hide();
		$('#triviaPanel').show();
	});		

}; // end intialize

// google.maps.event.addDomListener(window, 'load', initMap);
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
	//$displayAnswers.show();	
};

function nextWaypoint() {
	$('#USAMap').empty();
	$('#triviaPanel').hide();
	$('#USAMap').show();

					

	var seattleMarker = new google.maps.LatLng(47.620921,-122.349266);
	
			var directionsService = new google.maps.DirectionsService;
			var directionsDisplay = new google.maps.DirectionsRenderer;

			var mapUSAProperties = {
				center:new google.maps.LatLng(40.2617571,-94.8282592),
				zoom:1,
				mapTypeId:google.maps.MapTypeId.ROADMAP
			};
			var mapUSA=new google.maps.Map(document.getElementById("USAMap"),mapUSAProperties);
			
			directionsDisplay.setMap(mapUSA);

			// var onChangeHandler = function() {
			// 	calculateAndDisplayRoute(directionsService, directionsDisplay);
			// };
			
			directionsService.route({
				origin: {lat: waypoints["waypoint1"].lattitude, lng: waypoints["waypoint1"].longitude},
				destination: {lat: waypoints["waypoint2"].lattitude, lng: waypoints["waypoint2"].longitude},
				travelMode: 'DRIVING'
			}, function(response, status) {
				if (status === 'OK') {
					directionsDisplay.setDirections(response);
					
				} else {
					window.alert('Directions request failed due to ' + status);
				}
			});

		


	// directionsService.route({
	// 	origin: {lat: waypoints["waypoint1"].lattitude, lng: waypoints["waypoint1"].longitude},
	// 	destination: {lat: waypoints["waypoint2"].lattitude, lng: waypoints["waypoint2"].longitude},
	// 	travelMode: 'DRIVING'
	// }, function(response, status) {
	// 	if (status === 'OK') {
	// 		directionsDisplay.setDirections(response);
	// 		$('#USAMap').show();
	// 		$('#triviaPanel').hide();

	// 	} else {
	// 		window.alert('Directions request failed due to ' + status);
	// 	}
	// });



	// var request = {
	// 	origin: {location: {lat: waypoints["waypoint1"].lattitude,
	// 						lng: waypoints["waypoint1"].longitude}},

	// 	destination: {location: {lat: waypoints["Portland"].lattitude,
	// 							 lng: waypoints["Portland"].longitude}},
	// 	travelMode: google.maps.DirectionsTravelMode.DRIVING
	// };

	// directionsService.route(request, function (response, status) {
 //        if (status == google.maps.DirectionsStatus.OK) {
 //            directionsDisplay.setDirections(response);
 //            var route = response.routes[0];
 //            console.log("route:", route);
 //            var summaryPanel = document.getElementById("directions_panel");
 //            summaryPanel.innerHTML = "";
 //            // For each route, display summary information.
 //            for (var i = 0; i < route.legs.length; i++) {
 //                var routeSegment = i + 1;
 //                summaryPanel.innerHTML += "<b>Route Segment: " + routeSegment + "</b><br />";
 //                summaryPanel.innerHTML += route.legs[i].start_address + " to ";
 //                summaryPanel.innerHTML += route.legs[i].end_address + "<br />";
 //                summaryPanel.innerHTML += route.legs[i].distance.text + "<br /><br />";
 //            }
 //        } else {
 //            alert("directions response " + status);
 //        }
 //    });

}
//