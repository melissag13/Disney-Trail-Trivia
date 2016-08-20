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