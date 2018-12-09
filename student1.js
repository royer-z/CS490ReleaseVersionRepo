/*jshint esversion: 6 */
//"use strict"; // Avoids error message //Use in functions

var fData = new FormData();

fetch('checkLogin.php', {
	method: 'POST',
	body: fData
})
.then( res => res.json()) // Once we have a response
.then (newData => { // Data from response ^
	if (newData === 'loggedOut') {
		window.location.replace("index.html");
	}
	else {
		console.log(newData);
	}
});

var screen = document.getElementById('screen');

document.getElementById('takeE').onchange = function() {
	"use strict"; // Avoids error message
	takeExam();
};

document.getElementById('viewG').onchange = function() {
	"use strict"; // Avoids error message
	viewGrades();
};

function takeExam() {
	"use strict"; // Avoids error message
	screen.innerHTML = "<div id='chooseExamDiv'><h1>Choose an exam to take:</h1><div id='showOpenExamsDiv'><form id='selectExamForm'></form><p id='viewError'></p></div></div>";
	
	var error = document.getElementById('viewError');
	var selectExamForm = document.getElementById('selectExamForm');
	
	// Fetch all questions and display in 
	var mainForm = document.getElementById('student1MainForm');
	var fData = new FormData(mainForm);
	
	fetch('student1GetExams.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'error') {
			error.innerHTML = "ERROR GETTING AVAILABLE EXAMS";
		}
		else if (newData === 'loggedOut') {
			window.location.replace("index.html");
		}
		else{
			var item;
			for (item = 0; item < newData.openExams.length; item++) {
				selectExamForm.innerHTML += "<input type='radio' name='pickedE' value="+newData.openExams[item].examId+">"+newData.openExams[item].examName+"<br>";
			}
			selectExamForm.innerHTML += "<br><button type='button' id='checkedEButton' onclick='takeChecked()'>Take Exam</button>";
		}
	});
	
}

function viewGrades() {
	"use strict"; // Avoids error message
	screen.innerHTML = "<div id='viewGradesDiv'><h1>Graded exams:</h1><div id='showGradesDiv'><form id='selectGradeForm'></form><p id='viewReportResult'>Result: </p></div></div>";
	
	var selectGradeForm = document.getElementById('selectGradeForm');
	
	var mainForm = document.getElementById('student1MainForm');
	var fData = new FormData(mainForm);
	
	fetch('student1GetGrades.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'error') {
			selectGradeForm.innerHTML = "ERROR GETTING EXAMS";
		}
		else if (newData === 'loggedOut') {
			window.location.replace("index.html");
		}
		else{
			var item;
			for (item = 0; item < newData.gradedExams.length; item++) {
				if (newData.gradedExams[item].gradeReleased === "true"){
					selectGradeForm.innerHTML += "<input type='radio' name='examId' value="+newData.gradedExams[item].examId+">"+newData.gradedExams[item].examName+"<br>";
				}
			}
			selectGradeForm.innerHTML += "<button type='button' id='checkedGButton' onclick='viewChecked()'>View Report</button>";
		}
	});
}

function takeChecked() {
	"use strict"; // Avoids error message
	
	var screen = document.getElementById('screen');
	var error = document.getElementById('viewError');
	
	// Fetch exam
	var selectExamForm = document.getElementById('selectExamForm');
	var fData = new FormData(selectExamForm);
	
	fetch('student1RequestExamToTake.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'empty') {
			error.innerHTML = "ERROR GETTING EXAM TO TAKE";
		}
		else if (newData === 'loggedOut') {
			window.location.replace("index.html");
		}
		else {
			screen.innerHTML = "<div><h1>Please complete the "+newData.examName+" exam:</h1><div id='displayExamDiv'><form id='inputExamForm'></form><p id='answerError'>Result:</p></div></div>";
			
			var inputExamForm = document.getElementById('inputExamForm');
			for (var item = 0; item < newData.questions.length; item++) {
					var difficulty;
				if (newData.questions[item].difficulty === '1') {
					difficulty = 'Easy';
				}
				else if (newData.questions[item].difficulty === '2') {
					difficulty = 'Medium';
				}
				else if (newData.questions[item].difficulty === '3') {
					difficulty = 'Hard';
				}
				
				inputExamForm.innerHTML += "Topic: "+newData.questions[item].topic+" Difficulty: "+difficulty+"<br><strong>Question "+(item+1)+":</strong> "+newData.questions[item].questionText+"<br><strong>Required function name:</strong> "+newData.questions[item].functionName+" <strong>Constraint: </strong>"+newData.questions[item].constraint+" <strong>Points:</strong>"+newData.questions[item].points+"<br><textarea form='inputExamForm' name='studentAnswerText[]' rows='10' cols='100' placeholder='Write your solution here'></textarea><input type='hidden' name='questIds[]' value='"+newData.questions[item].questionId+"'<br><br>";
			}
			inputExamForm.innerHTML += "<button type='button' id='submitExamAnswersButton' onclick='submitExamAnswers()'>Submit Exam</button>";
		}
	});
}

function submitExamAnswers() {
	"use strict"; // Avoids error message
	var answerError = document.getElementById('answerError');
	
	var inputExamForm = document.getElementById('inputExamForm');
	var fData = new FormData(inputExamForm);
	
	for (var value of fData.entries()) {
		console.log(value);
	}
	
	fetch('student1SubmitExamAnswers.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'empty') {
			answerError.innerHTML = "ERROR IN SUBMISSION";
		}
		else if (newData === 'loggedOut') {
			window.location.replace("index.html");
		}
		else {
			answerError.innerHTML = "Exam Submitted!";
		}
	});
}

function viewChecked() {
	"use strict"; // Avoids error message
	
	var viewReportResult = document.getElementById('viewReportResult');
	var viewGradesDiv = document.getElementById('viewGradesDiv');
	
	var selectGradeForm = document.getElementById('selectGradeForm');
	var fData = new FormData(selectGradeForm);
	
	fetch('student1ViewReport.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'empty') {
			viewReportResult.innerHTML = "Please select an exam.";
		}
		else if (newData === 'loggedOut') {
			window.location.replace("index.html");
		}
		else{
			viewGradesDiv.innerHTML = "";
			if (newData.gradeReleased === "true") {
				viewGradesDiv.innerHTML += "<table><thead><tr><th>Question</th><th>Your answer</th><th>Total points</th><th>Adjustment</th><th>Adjustment reason</th><th>Comment</th><th>Points breakdown</th></tr></thead><tbody id='reportTableBody'></tbody><tfoot></tfoot></table>";
				
				var reportTableBody = document.getElementById("reportTableBody");
	
				var item;
				for (item = 0; item < newData.questions.length; item++) {
					var questionId = newData.questions[item].questionId;
					
					reportTableBody.innerHTML += "<tr><td>"+newData.questions[item].questionText+"</td><td>"+newData.questions[item].answerText+"</td><td>"+newData.questions[item].grade+"</td><td>"+newData.questions[item].instructorAdjustment+"</td><td>"+newData.questions[item].instructorAdjustmentReason+"</td><td>"+newData.questions[item].comment+"</td><td><table><thead><tr><th>Points</th><th>Reason</th></tr></thead><tbody id='forQ"+questionId+"'></tbody><tfoot></tfoot></table></td></tr>";
					
					var forQ = document.getElementById("forQ"+questionId);
					
					var pb;
					for (pb = 0; pb < newData.questions[item].pointBreakdown.length; pb++) {
						if (newData.questions[item].pointBreakdown[pb].points[0] === "0") {
							forQ.innerHTML += "<tr><td class='redHighlight'>"+newData.questions[item].pointBreakdown[pb].points+"</td><td>"+newData.questions[item].pointBreakdown[pb].reason+"</td></tr>";
						}
						else {
							forQ.innerHTML += "<tr><td class='greenHighlight'>"+newData.questions[item].pointBreakdown[pb].points+"</td><td>"+newData.questions[item].pointBreakdown[pb].reason+"</td></tr>";
						}
					}
				}
				viewGradesDiv.innerHTML += "<br><strong>Final exam grade:</strong>"+newData.grade+"<br><br>";
			}
			else {
				viewGradesDiv.innerHTML = "NO EXAM GRADES TO VIEW";
			}
		}
	});
}