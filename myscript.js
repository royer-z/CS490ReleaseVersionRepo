/*jshint esversion: 6 */

var loginForm = document.getElementById('loginForm');
var loginFormResult = document.getElementById('loginFormResult');

loginForm.addEventListener('submit', function(event) {
	"use strict"; // Avoids error message
	event.preventDefault(); // Prevents page refresh and hides form input from URL
	
	var fData = new FormData(loginForm);
	
	fetch('login.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'empty') {
			var textNode = document.createTextNode("Please fill in all fields.");
			loginFormResult.appendChild(textNode);
		}
		else{ 
			// Check if login is success and if instructor or student:
			// Middle may need to return student/professor UCID to redirect to correct pages
			var condition = 'true';
			for(var value of fData.values()) {
				if(condition === 'true') {
					var ucid = value;
					condition = 'false';
				}
				else if(condition === 'false') {
					var pass = value;
				}
			}
			if(newData.loginSucceeded === 'true' && newData.instructor === 'true') {
				loginFormResult.innerHTML = "Welcome professor!<br>"+"Login success: "+newData.loginSucceeded+"<br>"+"Instructor: "+newData.instructor+"<br>";
				if(ucid === 'ab123') {
					window.location.replace('instructor.html'); // redirect to instructor page
				}
			}
			else if(newData.loginSucceeded === 'true' && newData.instructor === 'false') {
				loginFormResult.innerHTML = "Welcome student!<br>"+"Login success: "+newData.loginSucceeded+"<br>"+"Instructor: "+newData.instructor+"<br>";
				if(ucid === 'Ma123') {
					window.location.replace('student1.html'); // redirect to student page
				}
				else if(ucid === 'Na123') {
					window.location.replace('student2.html'); // redirect to student page
				}
			}
			else { // If login is unsuccessful: Display prompt
				loginFormResult.innerHTML = "Incorrect login information.<br>"+" Login Success: "+newData.loginSucceeded+"<br>";
			}
		}
	});
});