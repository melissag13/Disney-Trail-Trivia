var waypoints = {
	"Seattle" :  {
						"lattitude" : 47.620921,
						"longitude" : -122.349266
	},
	"Portland" : {
						"lattitude" : 45.5425913,
						"longitude" : -122.7945059
	},
	"Sacramento" : {
						"lattitude" : 38.5617256,
						"longitude" : -121.5829973
	},
	"Reno" : {
						"lattitude" : 39.5581117,
						"longitude" : -119.9909261
	},
	"Salt Lake City" : {
						"lattitude" : 40.7767833,
						"longitude" : -112.0605696
	},
	"Denver" : {
						"lattitude" : 39.7645187,
						"longitude" : -104.9951961
	},
	"Omaha" : {
						"lattitude" : 41.2920321,
						"longitude" : -96.221333
	},
}


// var seattleMarker = new google.maps.LatLng(47.620921,-122.349266);

var seattleMarker = new google.maps.LatLng(waypoints["Seattle"].lattitude,
										   waypoints["Seattle"].longitude);

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
		var queryURL = "https://crossorigin.me/http://www.opentdb.com/api.php?amount=50&category=22&type=multiple";
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
		$('#displayQuestion').show();
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

	var question = response.results[0].question;

	console.log("question:", question);	

	$questionDiv.html(question);

	var correctAnswer = $('<button>')
						.attr("type", "button")
						.addClass("list-group-item answer")
						.html(response.results[0].correct_answer)
						.on('click', function() {
							//show map with next waypoint

							// assume correct answer
							var request = {
                    			origin: {location: {lat: waypoints["Seattle"].lattitude,
                    								lng: waypoints["Seattle"].longitude}},

                    			destination: {location: {lat: waypoints["Portland"].lattitude,
                    									 lng: waypoints["Portland"].longitude}},
                    			travelMode: google.maps.DirectionsTravelMode.DRIVING
                    		};

                    		directionsService.route(request, function (response, status) {
			                    if (status == google.maps.DirectionsStatus.OK) {
			                        directionsDisplay.setDirections(response);
			                        var route = response.routes[0];
			                        console.log("route:", route);
			                        var summaryPanel = document.getElementById("directions_panel");
			                        summaryPanel.innerHTML = "";
			                        // For each route, display summary information.
			                        for (var i = 0; i < route.legs.length; i++) {
			                            var routeSegment = i + 1;
			                            summaryPanel.innerHTML += "<b>Route Segment: " + routeSegment + "</b><br />";
			                            summaryPanel.innerHTML += route.legs[i].start_address + " to ";
			                            summaryPanel.innerHTML += route.legs[i].end_address + "<br />";
			                            summaryPanel.innerHTML += route.legs[i].distance.text + "<br /><br />";
			                        }
			                    } else {
			                        alert("directions response " + status);
			                    }
			                });


							//
							$('#USAMap').show();
							$('#displayQuestion').hide();
						});
	var incorrect1 = $('<button>')
						.attr("type", "button")
						.addClass("list-group-item answer")
						.html(response.results[0].incorrect_answers[0])
						.on('click', function() {
							//show map with next waypoint
							$('#USAMap').show();
							$('#displayQuestion').hide();
						});;
	var incorrect2 = $('<button>')
						.attr("type", "button")
						.addClass("list-group-item answer")
						.html(response.results[0].incorrect_answers[1])
						.on('click', function() {
							//show map with next waypoint
							$('#USAMap').show();
							$('#displayQuestion').hide();
						});;
	var incorrect3 = $('<button>')
						.attr("type", "button")
						.addClass("list-group-item answer")
						.html(response.results[0].incorrect_answers[2])
						.on('click', function() {
							//show map with next waypoint
							$('#USAMap').show();
							$('#displayQuestion').hide();
						});

	$questionDiv.append(correctAnswer).append(incorrect1).append(incorrect2).append(incorrect3);
	
}


