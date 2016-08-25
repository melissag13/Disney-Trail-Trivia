// Initialize Firebase
var config = {
	apiKey: "AIzaSyCIdEkHBPUmCpZJDFnortraCHhYyUGN43A",
	authDomain: "disney-trail.firebaseapp.com",
	databaseURL: "https://disney-trail.firebaseio.com",
	storageBucket: "disney-trail.appspot.com",
};

firebase.initializeApp(config);

var dataRef = firebase.database();

//Email validation 
function validateForm(e) {
	var email = $('#emailInput').val();
	var atpos = email.indexOf("@");
	var dotpos = email.lastIndexOf(".");
	if (atpos < 1 || 
		dotpos < atpos + 2 || 
		dotpos + 2 >= email.length) {
		document.getElementById("alert").innerHTML="Invalid Email";
		empty();
		return false;
	}
	return true;
}


$('#userLogin').on("submit", function(e) {
	e.preventDefault();
	var isValid = validateForm();
	if(!isValid) {
		return ;
	}
	// Initial Values
	var name = $('#nameInput').val().trim();
	var email = $('#emailInput').val().trim();
	
	dataRef.ref().push({
		name: name,
		email: email,
	});

	// Don't refresh the page!
	//return false;

	//Clears form
	$("#nameInput").val("");
	$("#emailInput").val("");
	
	var currentLocation = window.location.href; //index.html
	console.log(currentLocation);
	var nextLocation = currentLocation.replace('index', 'disney-trail'); // disney-trail.html
	console.log("nextLocation:", nextLocation);
	// Doesn't refresh the page
	window.location = nextLocation;
});

//Firebase watcher + initial loader 
dataRef.ref().on("child_added", function(childSnapshot) {
	// Log everything that's coming out of snapshot
	console.log(childSnapshot.val().name);
	console.log(childSnapshot.val().email);
// Handle the errors
}, function(errorObject){
	console.log("Errors handled: " + errorObject.code)
});
