var waypoints = [
    {   "city" : "Seattle",
        "state" : "WA",
        "lattitude" : 47.620921,
        "longitude" : -122.349266
    },
    {   "city" : "Portland",
        "state" : "OR",
        "lattitude" : 45.5425913,
        "longitude" : -122.7945059
    },
    {   "city" : "Sacramento",
        "state" : "CA",
        "lattitude" : 38.5617256,
        "longitude" : -121.5829973
    },
    {   "city" : "Denver",
        "state" : "C0",
        "lattitude" : 39.7645187,
        "longitude" : -104.9951961
    },  
    {   "city" : "Independence",
        "state" : "MO",
        "lattitude" : 39.1185682,
        "longitude" : -94.4713356
    },
    {   "city" : "Chicago",
        "state" : "IL",
        "lattitude" : 41.8987739,
        "longitude" : -87.6251055
    },
    {   "city" : "Atlanta",
        "state" : "GA",
        "lattitude" : 33.7348124,
        "longitude" : -84.3921616
    },
    {   "city" : "Orlando",
        "state" : "FL",     
        "lattitude" : 28.3714667,
        "longitude" : -81.5502655
    }
]
// Global variables to keep track of current waypoint index
currentWaypointIndex = 0;
// Declare these globally so we can reuse map
var directionsService = new google.maps.DirectionsService;
var directionsDisplay = new google.maps.DirectionsRenderer;
// Global for now
var mapUSA;

var waypointsArray = [];

function initialize() { 
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
        icon:'kh-car-icon.png',
        title: 'Click here to start',
    });
    //Add the marker to the map
    marker.setMap(mapUSA);
    // // Create an info window to display a text bubble on the map
    // var infoWindow = new google.maps.InfoWindow({
    //  content: "Click here to start!"
    // });
    // // Add the info window to the map
    // infoWindow.open(mapUSA, marker);

    // Add an onclick listener
    google.maps.event.addListener(marker, 'click',function() {
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
                icon:'kh-car-icon.png',
                title: 'Click here to continue',
            });
            //Add the marker to the map
            currentDestinationMarker.setMap(mapUSA);
            // Add an onclick listener
            google.maps.event.addListener(currentDestinationMarker, 'click',function() {
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
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}
//







// var SCREEN_WIDTH = window.innerWidth,
//     SCREEN_HEIGHT = window.innerHeight,
//     mousePos = {
//         x: 400,
//         y: 300
//     },

//     // create canvas
//     canvas = document.createElement('canvas'),
//     context = canvas.getContext('2d'),
//     particles = [],
//     rockets = [],
//     MAX_PARTICLES = 400,
//     colorCode = 0;

// // init
// $(document).ready(function() {
//     document.body.appendChild(canvas);
//     canvas.width = SCREEN_WIDTH;
//     canvas.height = SCREEN_HEIGHT;
//     setInterval(launch, 800);
//     setInterval(loop, 1000 / 50);
// });

// // update mouse position
// $(document).mousemove(function(e) {
//     e.preventDefault();
//     mousePos = {
//         x: e.clientX,
//         y: e.clientY
//     };
// });

// // launch more rockets!!!
// $(document).mousedown(function(e) {
//     for (var i = 0; i < 5; i++) {
//         launchFrom(Math.random() * SCREEN_WIDTH * 2 / 3 + SCREEN_WIDTH / 6);
//     }
// });

// function launch() {
//     launchFrom(mousePos.x);
// }

// function launchFrom(x) {
//     if (rockets.length < 10) {
//         var rocket = new Rocket(x);
//         rocket.explosionColor = Math.floor(Math.random() * 360 / 10) * 10;
//         rocket.vel.y = Math.random() * -3 - 4;
//         rocket.vel.x = Math.random() * 6 - 3;
//         rocket.size = 8;
//         rocket.shrink = 0.999;
//         rocket.gravity = 0.01;
//         rockets.push(rocket);
//     }
// }

// function loop() {
//     // update screen size
//     if (SCREEN_WIDTH != window.innerWidth) {
//         canvas.width = SCREEN_WIDTH = window.innerWidth;
//     }
//     if (SCREEN_HEIGHT != window.innerHeight) {
//         canvas.height = SCREEN_HEIGHT = window.innerHeight;
//     }

//     // clear canvas
//     context.fillStyle = "rgba(0, 0, 0, 0.05)";
//     context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

//     var existingRockets = [];

//     for (var i = 0; i < rockets.length; i++) {
//         // update and render
//         rockets[i].update();
//         rockets[i].render(context);

//         // calculate distance with Pythagoras
//         var distance = Math.sqrt(Math.pow(mousePos.x - rockets[i].pos.x, 2) + Math.pow(mousePos.y - rockets[i].pos.y, 2));

//         // random chance of 1% if rockets is above the middle
//         var randomChance = rockets[i].pos.y < (SCREEN_HEIGHT * 2 / 3) ? (Math.random() * 100 <= 1) : false;

// /* Explosion rules
//              - 80% of screen
//             - going down
//             - close to the mouse
//             - 1% chance of random explosion
//         */
//         if (rockets[i].pos.y < SCREEN_HEIGHT / 5 || rockets[i].vel.y >= 0 || distance < 50 || randomChance) {
//             rockets[i].explode();
//         } else {
//             existingRockets.push(rockets[i]);
//         }
//     }

//     rockets = existingRockets;

//     var existingParticles = [];

//     for (var i = 0; i < particles.length; i++) {
//         particles[i].update();

//         // render and save particles that can be rendered
//         if (particles[i].exists()) {
//             particles[i].render(context);
//             existingParticles.push(particles[i]);
//         }
//     }

//     // update array with existing particles - old particles should be garbage collected
//     particles = existingParticles;

//     while (particles.length > MAX_PARTICLES) {
//         particles.shift();
//     }
// }

// function Particle(pos) {
//     this.pos = {
//         x: pos ? pos.x : 0,
//         y: pos ? pos.y : 0
//     };
//     this.vel = {
//         x: 0,
//         y: 0
//     };
//     this.shrink = .97;
//     this.size = 2;

//     this.resistance = 1;
//     this.gravity = 0;

//     this.flick = false;

//     this.alpha = 1;
//     this.fade = 0;
//     this.color = 0;
// }

// Particle.prototype.update = function() {
//     // apply resistance
//     this.vel.x *= this.resistance;
//     this.vel.y *= this.resistance;

//     // gravity down
//     this.vel.y += this.gravity;

//     // update position based on speed
//     this.pos.x += this.vel.x;
//     this.pos.y += this.vel.y;

//     // shrink
//     this.size *= this.shrink;

//     // fade out
//     this.alpha -= this.fade;
// };

// Particle.prototype.render = function(c) {
//     if (!this.exists()) {
//         return;
//     }

//     c.save();

//     c.globalCompositeOperation = 'lighter';

//     var x = this.pos.x,
//         y = this.pos.y,
//         r = this.size / 2;

//     var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
//     gradient.addColorStop(0.1, "rgba(255,255,255," + this.alpha + ")");
//     gradient.addColorStop(0.8, "hsla(" + this.color + ", 100%, 50%, " + this.alpha + ")");
//     gradient.addColorStop(1, "hsla(" + this.color + ", 100%, 50%, 0.1)");

//     c.fillStyle = gradient;

//     c.beginPath();
//     c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size : this.size, 0, Math.PI * 2, true);
//     c.closePath();
//     c.fill();

//     c.restore();
// };

// Particle.prototype.exists = function() {
//     return this.alpha >= 0.1 && this.size >= 1;
// };

// function Rocket(x) {
//     Particle.apply(this, [{
//         x: x,
//         y: SCREEN_HEIGHT}]);

//     this.explosionColor = 0;
// }

// Rocket.prototype = new Particle();
// Rocket.prototype.constructor = Rocket;

// Rocket.prototype.explode = function() {
//     var count = Math.random() * 10 + 80;

//     for (var i = 0; i < count; i++) {
//         var particle = new Particle(this.pos);
//         var angle = Math.random() * Math.PI * 2;

//         // emulate 3D effect by using cosine and put more particles in the middle
//         var speed = Math.cos(Math.random() * Math.PI / 2) * 15;

//         particle.vel.x = Math.cos(angle) * speed;
//         particle.vel.y = Math.sin(angle) * speed;

//         particle.size = 10;

//         particle.gravity = 0.2;
//         particle.resistance = 0.92;
//         particle.shrink = Math.random() * 0.05 + 0.93;

//         particle.flick = true;
//         particle.color = this.explosionColor;

//         particles.push(particle);
//     }
// };

// Rocket.prototype.render = function(c) {
//     if (!this.exists()) {
//         return;
//     }

//     c.save();

//     c.globalCompositeOperation = 'lighter';

//     var x = this.pos.x,
//         y = this.pos.y,
//         r = this.size / 2;

//     var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
//     gradient.addColorStop(0.1, "rgba(255, 255, 255 ," + this.alpha + ")");
//     gradient.addColorStop(1, "rgba(0, 0, 0, " + this.alpha + ")");

//     c.fillStyle = gradient;

//     c.beginPath();
//     c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size / 2 + this.size / 2 : this.size, 0, Math.PI * 2, true);
//     c.closePath();
//     c.fill();

//     c.restore();
// };