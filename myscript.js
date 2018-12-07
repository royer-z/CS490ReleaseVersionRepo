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
			loginFormResult.innerHTML = "";
			var textNode = document.createTextNode("Please fill in all fields.");
			loginFormResult.appendChild(textNode);
		}
		else{ // Check if login is success and if instructor or student:
			// Records user UCID
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
				loginFormResult.innerHTML = "";
				var textNode = document.createTextNode("Welcome professor!");
				loginFormResult.appendChild(textNode);
				/*
				var node = document.createElement("BR");
				loginFormResult.appendChild(node);
				
				textNode = document.createTextNode("Login Success: "+newData.loginSucceeded);
				loginFormResult.appendChild(textNode);
				
				node = document.createElement("BR");
				loginFormResult.appendChild(node);
				
				textNode = document.createTextNode("Instructor: "+newData.instructor);
				loginFormResult.appendChild(textNode);
				*/
				if(ucid === 'ab123') {
					window.location.replace('instructor.html'); // redirect to instructor page
				}
			}
			else if(newData.loginSucceeded === 'true' && newData.instructor === 'false') {
				loginFormResult.innerHTML = "";
				var textNode = document.createTextNode("Welcome student!");
				loginFormResult.appendChild(textNode);
				/*
				var node = document.createElement("BR");
				loginFormResult.appendChild(node);
				
				textNode = document.createTextNode("Login Success: "+newData.loginSucceeded);
				loginFormResult.appendChild(textNode);
				
				node = document.createElement("BR");
				loginFormResult.appendChild(node);
				
				textNode = document.createTextNode("Instructor: "+newData.instructor);
				loginFormResult.appendChild(textNode);
				*/
				if(ucid === 'Ma123') {
					window.location.replace('student1.html'); // redirect to student page
				}
				else if(ucid === 'Na123') {
					window.location.replace('student2.html'); // redirect to student page
				}
			}
			else { // If login is unsuccessful: Display prompt
				loginFormResult.innerHTML = "";
				var textNode = document.createTextNode("Incorrect login information.");
				loginFormResult.appendChild(textNode);
				/*
				var node = document.createElement("BR");
				loginFormResult.appendChild(node);
				
				textNode = document.createTextNode("Login Success: "+newData.loginSucceeded);
				loginFormResult.appendChild(textNode);
				*/
			}
		}
	});
});