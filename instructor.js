/*jshint esversion: 6 */
//"use strict"; // Avoids error message //Use in functions

checkLogin();

var splitScreen = document.getElementById('splitScreen');
var filterTopic = 'none';
var filterDifficulty = 'none';

document.getElementById('createQ').onchange = function() {
	"use strict"; // Avoids error message
	createQuestion();
};

document.getElementById('createE').onchange = function() {
	"use strict"; // Avoids error message
	createExam();
};

document.getElementById('releaseE').onchange = function() {
	"use strict"; // Avoids error message
	releaseExam();
};

document.getElementById('releaseG').onchange = function() {
	"use strict"; // Avoids error message
	releaseGrade();
};

function checkLogin() {
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
}

// Topics: conditional execution, iteration, strings, output, loops
// Constraints: if/else statement, for loop, while loop, recursion

function createQuestion() {
	"use strict"; // Avoids error message
	
	filterTopic = 'none';
	filterDifficulty = 'none';
	
	/*
	var bankNode = document.createElement("DIV");
	bankNode.setAttribute("id", "recentlyAddedQ");
	
	var hNode = document.createElement("H1");
	var textNode = document.createTextNode("Question bank");
	hNode.appendChild(textNode);
	
	bankNode.appendChild(hNode);
	
	var filterNode = document.createElement("DIV");
	filterNode.setAttribute("id", "qListFilterHead");
	
	bankNode.appendChild(filterNode);
	
	var listNode = document.createElement("DIV");
	listNode.setAttribute("id", "questionsListDiv");
	
	bankNode.appendChild(listNode);
	*/
	
	splitScreen.innerHTML = "<div id='recentlyAddedQ'><h1 class='instructorHeadings'>Question bank</h1><div id='qListFilterHead'></div><div id='questionsListDiv'></div></div>";
	
	splitScreen.innerHTML += "<div id='addQ'><h1 class='instructorHeadings'>Create a question</h1><form id='addQForm'><textarea form='addQForm' name='prompt' placeholder='Question' rows='3' cols='54.5'></textarea><br><input type='text' name='functionName' placeholder='Required function name'><br><label class='filterLabels'>Constraint:&nbsp;</label><select name='constraint'><option value='none'>none</option><option value='if/else statement'>if/else statement</option><option value='for loop'>for loop</option><option value='while loop'>while loop</option><option value='recursion'>recursion</option></select>&nbsp;<label class='filterLabels'>Topic:&nbsp;</label><select name='topic'><option value='other'>other</option><option value='conditional execution'>conditional execution</option><option value='iteration'>iteration</option><option value='strings'>strings</option><option value='output'>output</option><option value='loops'>loops</option></select><br><br><label class='filterLabels'>Difficulty:&nbsp;</label><input type='radio' name='difficulty' value='1' checked='checked'><label class='filterLabels easyDifficulty'>Easy&nbsp;</label><input type='radio' name='difficulty' value='2'><label class='filterLabels mediumDifficulty'>Medium&nbsp;</label><input type='radio' name='difficulty' value='3'><label class='filterLabels hardDifficulty'>Hard&nbsp;</label><br><br><input type='text' name='testCaseInput1' placeholder='Test case 1: input'>&nbsp;&nbsp;<input type='text' name='testCaseOutput1' placeholder='Test case 1: output'><br><input type='text' name='testCaseInput2' placeholder='Test case 2: input'>&nbsp;&nbsp;<input type='text' name='testCaseOutput2' placeholder='Test case 2: output'><br><input type='text' name='testCaseInput3' placeholder='Test case 3: input'>&nbsp;&nbsp;<input type='text' name='testCaseOutput3' placeholder='Test case 3: output'><br><input type='text' name='testCaseInput4' placeholder='Test case 4: input'>&nbsp;&nbsp;<input type='text' name='testCaseOutput4' placeholder='Test case 4: output'><br><input type='text' name='testCaseInput5' placeholder='Test case 5: input'>&nbsp;&nbsp;<input type='text' name='testCaseOutput5' placeholder='Test case 5: output'><br><input type='text' name='testCaseInput6' placeholder='Test case 6: input'>&nbsp;&nbsp;<input type='text' name='testCaseOutput6' placeholder='Test case 6: output'><br><br><button type='button' id='addQButton' class='button whiteFont' onclick='submitQuestion()'>Create question</button>&nbsp;<button type='button' id='resetAQFormButton' class='button whiteFont' onclick='resetAQForm()'>Reset form</button><p id='error'></p></form></div>";
	
	var qListFilterHead = document.getElementById('qListFilterHead');
	
	qListFilterHead.innerHTML += "<form id='qListTopicFilterForm'><label class='filterLabels'>Topic:&nbsp;</label><select onchange='filterEditTopic(this.value)'><option value='none'>none</option><option value='other'>other</option><option value='conditional execution'>conditional execution</option><option value='iteration'>iteration</option><option value='strings'>strings</option><option value='output'>output</option><option value='loops'>loops</option></select></form>";
	qListFilterHead.innerHTML += "<form id='qListDifficultyFilterForm'><label class='filterLabels'>Difficulty:&nbsp;</label><select onchange='filterEditDifficulty(this.value)'><option value='none'>none</option><option value='1'>easy</option><option value='2'>medium</option><option value='3'>hard</option></select></form><button type='button' id='filterQLButton' class='button whiteFont' onclick='getFiltered2()'>Filter</button>&nbsp;<button type='button' id='resetQListFiltersButton' class='button whiteFont' onclick='resetQListFilters()'>Reset filters</button><p id='filterError2'><p></form><p id='filterValues2'></p><br>";
	
	var questionsListDiv = document.getElementById('questionsListDiv');
	var instructorMainForm = document.getElementById('instructorMainForm');
	var fData = new FormData(instructorMainForm);

	fetch('instructorShowQ.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'error') {
			error.innerHTML = "ERROR DISPLAYING QUESTIONS LIST";
		}
		else if (newData === 'loggedOut') {
			window.location.replace("index.html");
		}
		else{
			questionsListDiv.innerHTML += "<table><thead><tr><th>&nbsp;Question&nbsp;</th><th>&nbsp;Topic&nbsp;</th><th>&nbsp;Difficulty&nbsp;</th></tr></thead><tbody id='CQQBTableBody'></tbody><tfoot></tfoot></table><br>";
			
			var CQQBTableBody = document.getElementById("CQQBTableBody");
			
			var item;
			for (item = 0; item < newData.questions.length; item++) {
				var difficulty;
				var difficultyClass;
				if(newData.questions[item].difficulty === '1') {
					difficulty= "Easy";
					difficultyClass = "easyDifficulty";
				}
				else if(newData.questions[item].difficulty === '2') {
					difficulty = "Medium";
					difficultyClass = "mediumDifficulty";
				}
				else if(newData.questions[item].difficulty === '3') {
					difficulty = "Hard";
					difficultyClass = "hardDifficulty";
				}
				
				CQQBTableBody.innerHTML += "<tr><td class='left'>"+newData.questions[item].questionText+"</td><td class='centered'>"+newData.questions[item].topic+"</td><td class='"+difficultyClass+" centered'>"+difficulty+"</td></tr>";
			}
		}
	});
}

function resetAQForm() {
	"use strict"; // Avoids error message
	document.getElementById('addQForm').reset();
	var error = document.getElementById('error');
	error.innerHTML = "";
}

function resetQListFilters() {
	"use strict"; // Avoids error message
	document.getElementById('qListTopicFilterForm').reset();
	document.getElementById('qListDifficultyFilterForm').reset();
	
	filterEditTopic('none');
	filterEditDifficulty('none');
}

function resetFilters() {
	"use strict"; // Avoids error message
	document.getElementById('topicFilterForm').reset();
	document.getElementById('difficultyFilterForm').reset();
	
	filterListTopic('none');
	filterListDifficulty('none');
}

var allQuestions; // Tim's solution
function createExam() {
	"use strict"; // Avoids error message
	
	filterTopic = 'none';
	filterDifficulty = 'none';
	
	splitScreen.innerHTML = "<div id='examDraft'><h1 class='instructorHeadings'>Exam draft</h1><div id='examDraftDiv'><form id='draftPointsForm'><input type='text' name='examName' id='examName' placeholder='Exam name'><button type='button' id='checkedQButton' class='button whiteFont' onclick='addAllChecked()'>Create exam</button><p id='examError'></p><table id='CEEDTable'><thead><tr><th>&nbsp;Question&nbsp;</th><th>&nbsp;Topic&nbsp;</th><th>&nbsp;Difficulty&nbsp;</th><th>&nbsp;Points worth&nbsp;</th></tr></thead><tbody id='CEEDTableBody'></tbody><tfoot></tfoot></table></form><br></div></div><div id='availableQ'><h1 class='instructorHeadings'>Question bank</h1><div id='filterHead'></div><form id='selectQForm'></form></div>";
	
	var filterHead = document.getElementById('filterHead');
	var selectQForm = document.getElementById('selectQForm');
	
	filterHead.innerHTML += "<form id='topicFilterForm'><label class='filterLabels'>Topic:&nbsp;</label><select onchange='filterListTopic(this.value)'><option value='none'>none</option><option value='other'>other</option><option value='conditional execution'>conditional execution</option><option value='iteration'>iteration</option><option value='strings'>strings</option><option value='output'>output</option><option value='loops'>loops</option></select></form>";
	
	filterHead.innerHTML += "<form id='difficultyFilterForm'><label class='filterLabels'>Difficulty:&nbsp;</label><select onchange='filterListDifficulty(this.value)'><option value='none'>none</option><option value='1'>easy</option><option value='2'>medium</option><option value='3'>hard</option></select></form><button type='button' id='filterButton' class='button whiteFont' onclick='getFiltered()'>Filter</button><button type='button' id='resetFiltersButton' class='button whiteFont' onclick='resetFilters()'>Reset filters</button><p id='filterError'><p id='filterValues'></p><br>";
	
	// Fetch all questions and display
	var instructorMainForm = document.getElementById('instructorMainForm');
	var fData = new FormData(instructorMainForm);
	
	fetch('instructorCreateE.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'error') {
			selectQForm.innerHTML = "ERROR";
		}
		else if (newData === 'loggedOut') {
			window.location.replace("index.html");
		}
		else{
			allQuestions = newData.questions; // Tim's solution
			console.log(allQuestions[0]);
			
			selectQForm.innerHTML += "<table><thead><tr><th>&nbsp;Select&nbsp;</th><th>&nbsp;Question&nbsp;</th><th>&nbsp;Topic&nbsp;</th><th>&nbsp;Difficulty&nbsp;</th></tr></thead><tbody id='CEQBTableBody'></tbody><tfoot></tfoot></table><br>";
			
			var CEQBTableBody = document.getElementById("CEQBTableBody");
			
			var item;
			for (item = 0; item < newData.questions.length; item++) {
				var difficulty;
				var difficultyClass;
				if(newData.questions[item].difficulty === '1') {
					difficulty= "Easy";
					difficultyClass = "easyDifficulty";
				}
				else if(newData.questions[item].difficulty === '2') {
					difficulty = "Medium";
					difficultyClass = "mediumDifficulty";
				}
				else if(newData.questions[item].difficulty === '3') {
					difficulty = "Hard";
					difficultyClass = "hardDifficulty";
				}
				
				CEQBTableBody.innerHTML += "<tr><td class='centered'><button type='button' class='button whiteFont' onclick='refreshExamDraft("+newData.questions[item].questionId+")'>+|-</button></td><td class='left'>"+newData.questions[item].questionText+"</td><td class='centered'>"+newData.questions[item].topic+"</td><td class='"+difficultyClass+" centered'>"+difficulty+"</td></tr>";
			}
		}
	});
}

function refreshExamDraft(questionId) {
	"use strict"; // Avoids error message
	
	var draftPointsForm = document.getElementById("draftPointsForm");
	var CEEDTableBody = document.getElementById("CEEDTableBody");
	var target = document.getElementById(questionId);
	console.log("TARGET:"+target);
	
	if (target !== null) {
		CEEDTableBody.removeChild(target);
	}
	else {
		var fData = new FormData();
	
		fData.append('questionId', questionId);

		fetch('instructorGetQuestion.php', {
			method: 'POST',
			body: fData
		})
		.then( res => res.json()) // Once we have a response
		.then (newData => { // Data from response ^
			if(newData === 'error') {
				draftPointsForm.innerHTML = "ERROR REFRESHING DRAFT";
			}
			else if (newData === 'loggedOut') {
				window.location.replace("index.html");
			}
			else{
				var tableRow = document.createElement("TR");
				tableRow.setAttribute("id", questionId);
				
				var tableData = document.createElement("TD");
				tableData.setAttribute("class", "left");
				
				var textNode = document.createTextNode(newData.questionText);
				
				tableData.appendChild(textNode);
				tableRow.appendChild(tableData);
				
				tableData = document.createElement("TD");
				tableData.setAttribute("class", "centered");
				
				textNode = document.createTextNode(newData.topic);
				tableData.appendChild(textNode);
				
				tableData.appendChild(textNode);
				tableRow.appendChild(tableData);
				
				var difficulty;
				var difficultyClass;
				
				if(newData.difficulty === '1') {
					difficulty= "Easy";
					difficultyClass = "easyDifficulty";
				}
				else if(newData.difficulty === '2') {
					difficulty = "Medium";
					difficultyClass = "mediumDifficulty";
				}
				else if(newData.difficulty === '3') {
					difficulty = "Hard";
					difficultyClass = "hardDifficulty";
				}
				
				tableData = document.createElement("TD");
				tableData.setAttribute("class", difficultyClass+" centered");
				
				textNode = document.createTextNode(difficulty);
				tableData.appendChild(textNode);
				
				tableData.appendChild(textNode);
				tableRow.appendChild(tableData);
				
				tableData = document.createElement("TD");
				tableData.setAttribute("class", "centered");
				
				var node = document.createElement('INPUT');
				node.setAttribute('type', 'text');
				node.setAttribute("class", "centered pointsInput");
				node.setAttribute("size", "2");
				node.setAttribute('name', 'questionPoints[]');
				
				
				tableData.appendChild(node);
				tableRow.appendChild(tableData);
				
				var node = document.createElement('INPUT');
				node.setAttribute('type', 'hidden');
				node.setAttribute('name', 'pickedQ[]');
				node.setAttribute('value', questionId);
				tableRow.appendChild(node);

				CEEDTableBody.appendChild(tableRow);
			}
		});	
	}
}

function addAllChecked() {
	"use strict"; // Avoids error message
	
	var examError = document.getElementById('examError');
	var draftPointsForm = document.getElementById('draftPointsForm');
	
	var fData = new FormData(draftPointsForm);
	
	var emptyDetected = 'false';
	for (var pair of fData.entries()) {
		console.log("P1:"+pair[0]+"P2:"+pair[1]);
		if (pair[1] === '') {
			emptyDetected = 'true';
		}
	}
	
	fData.append('empty', emptyDetected);
	
	fetch('instructorSubmitExam.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		console.log(newData);
		if(newData === 'empty') {
			examError.innerHTML = "Please fill in all fields.";
		}
		else if (newData === 'loggedOut') {
			window.location.replace("index.html");
		}
		else if (newData === 'emptyIds') {
			examError.innerHTML = "Please select at least one question."; 
	 	}
		else {
			examError.innerHTML = "Exam Created!";
		}
	});
}

function getFiltered() {
	var selectQForm = document.getElementById('selectQForm');
	var topicFilterForm = document.getElementById('topicFilterForm');
	var difficultyFilterForm = document.getElementById('difficultyFilterForm');
	
	var filterError = document.getElementById('filterError');
	
	if (topicFilterForm.lastChild.nodeName === "INPUT") {
		topicFilterForm.removeChild(topicFilterForm.lastChild);
		var input = document.createElement("INPUT");
		input.setAttribute('type', 'hidden');
		input.setAttribute('name', 'topicInput');
		input.setAttribute('value', filterTopic);
		topicFilterForm.appendChild(input);
	}
	else {
		var input = document.createElement("INPUT");
		input.setAttribute('type', 'hidden');
		input.setAttribute('name', 'topicInput');
		input.setAttribute('value', filterTopic);
		topicFilterForm.appendChild(input);
	}
	
	if (difficultyFilterForm.lastChild.nodeName === "INPUT") {
		difficultyFilterForm.removeChild(difficultyFilterForm.lastChild);
		var input = document.createElement("INPUT");
		input.setAttribute('type', 'hidden');
		input.setAttribute('name', 'difficultyInput');
		input.setAttribute('value', filterDifficulty);
		difficultyFilterForm.appendChild(input);
	}
	else {
		var input = document.createElement("INPUT");
		input.setAttribute('type', 'hidden');
		input.setAttribute('name', 'difficultyInput');
		input.setAttribute('value', filterDifficulty);
		difficultyFilterForm.appendChild(input);
	}
	
	var fData = new FormData(topicFilterForm);
	var fData2 = new FormData(difficultyFilterForm);
	
	for (var pair of fData2.entries()) {
		fData.append(pair[0], pair[1]);
	}
	
	for (var pair of fData.entries()) {
		console.log("P1:"+pair[0]+"P2:"+pair[1]);
	}
	
	fetch('instructorRequestFilter.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'empty') {
			filterError.innerHTML = "EMPTY";
		}
		else if (newData === 'loggedOut') {
			window.location.replace("index.html");
		}
		else{
			selectQForm.innerHTML = "<table><thead><tr><th>&nbsp;Select&nbsp;</th><th>&nbsp;Question&nbsp;</th><th>&nbsp;Topic&nbsp;</th><th>&nbsp;Difficulty&nbsp;</th></tr></thead><tbody id='CEQBTableBody'></tbody><tfoot></tfoot></table><br>";
			
			var CEQBTableBody = document.getElementById("CEQBTableBody");
			
			var item;
			for (item = 0; item < newData.questions.length; item++) {
				var difficulty;
				var difficultyClass;
				if(newData.questions[item].difficulty === '1') {
					difficulty= "Easy";
					difficultyClass = "easyDifficulty";
				}
				else if(newData.questions[item].difficulty === '2') {
					difficulty = "Medium";
					difficultyClass = "mediumDifficulty";
				}
				else if(newData.questions[item].difficulty === '3') {
					difficulty = "Hard";
					difficultyClass = "hardDifficulty";
				}
				
				CEQBTableBody.innerHTML += "<tr><td class='centered'><button type='button' class='button whiteFont' onclick='refreshExamDraft("+newData.questions[item].questionId+")'>+|-</button></td><td class='left'>"+newData.questions[item].questionText+"</td><td class='centered'>"+newData.questions[item].topic+"</td><td class='"+difficultyClass+" centered'>"+difficulty+"</td></tr>";
				
				//<input type='checkbox' onchange='refreshExamDraft("+newData.questions[item].questionId+")'>
			}
		}
	});
	
}

function filterListTopic(option) {
	"use strict"; // Avoids error message
	//var filterValues = document.getElementById('filterValues');
	
	if (option === 'none') {
		var topicValue = filterTopic;
		filterTopic = 'none';
		//filterValues.innerHTML = "Selected: "+filterTopic+", "+filterDifficulty;
		console.log("REMOVED:"+topicValue);
		console.log("AFTERADD: "+"T:"+filterTopic+"D:"+filterDifficulty);
	}
	else {
		filterTopic = option;
		//filterValues.innerHTML = "Selected: "+filterTopic+", "+filterDifficulty;
		console.log("ADDED:"+option);
		console.log("AFTERADD: "+"T:"+filterTopic+"D:"+filterDifficulty);
	}
}

function filterListDifficulty(option) {
	"use strict"; // Avoids error message
	//var filterValues = document.getElementById('filterValues');
	
	if (option === 'none') {
		var difficultyValue = filterDifficulty;
		filterDifficulty = 'none';
		//filterValues.innerHTML = "Selected: "+filterTopic+", "+filterDifficulty;
		console.log("REMOVED:"+difficultyValue);
		console.log("AFTERADD: "+"T:"+filterTopic+"D:"+filterDifficulty);
	}
	else {
		filterDifficulty = option;
		//filterValues.innerHTML = "Selected: "+filterTopic+", "+filterDifficulty;
		console.log("ADDED:"+option);
		console.log("AFTERADD: "+"T:"+filterTopic+"D:"+filterDifficulty);
	}
}

function getFiltered2() {
	var questionsListDiv = document.getElementById('questionsListDiv');
	var qListTopicFilterForm = document.getElementById('qListTopicFilterForm');
	var qListDifficultyFilterForm = document.getElementById('qListDifficultyFilterForm');
	
	var filterError2 = document.getElementById('filterError2');
	
	if (qListTopicFilterForm.lastChild.nodeName === "INPUT") {
		qListTopicFilterForm.removeChild(qListTopicFilterForm.lastChild);
		var input = document.createElement("INPUT");
		input.setAttribute('type', 'hidden');
		input.setAttribute('name', 'topicInput');
		input.setAttribute('value', filterTopic);
		qListTopicFilterForm.appendChild(input);
	}
	else {
		var input = document.createElement("INPUT");
		input.setAttribute('type', 'hidden');
		input.setAttribute('name', 'topicInput');
		input.setAttribute('value', filterTopic);
		qListTopicFilterForm.appendChild(input);
	}
	
	if (qListDifficultyFilterForm.lastChild.nodeName === "INPUT") {
		qListDifficultyFilterForm.removeChild(qListDifficultyFilterForm.lastChild);
		var input = document.createElement("INPUT");
		input.setAttribute('type', 'hidden');
		input.setAttribute('name', 'difficultyInput');
		input.setAttribute('value', filterDifficulty);
		qListDifficultyFilterForm.appendChild(input);
	}
	else {
		var input = document.createElement("INPUT");
		input.setAttribute('type', 'hidden');
		input.setAttribute('name', 'difficultyInput');
		input.setAttribute('value', filterDifficulty);
		qListDifficultyFilterForm.appendChild(input);
	}
	
	var fData = new FormData(qListTopicFilterForm);
	var fData2 = new FormData(qListDifficultyFilterForm);
	
	for (var pair of fData2.entries()) {
		fData.append(pair[0], pair[1]);
	}
	
	for (var pair of fData.entries()) {
		console.log("P1:"+pair[0]+"P2:"+pair[1]);
	}
	
	fetch('instructorRequestFilter.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'empty') {
			filterError2.innerHTML = "EMPTY";
		}
		else if (newData === 'loggedOut') {
			window.location.replace("index.html");
		}
		else{
			questionsListDiv.innerHTML = "";
			
			questionsListDiv.innerHTML += "<table><thead><tr><th>&nbsp;Question&nbsp;</th><th>&nbsp;Topic&nbsp;</th><th>&nbsp;Difficulty&nbsp;</th></tr></thead><tbody id='CQQBTableBody'></tbody><tfoot></tfoot></table><br>";
			
			var CQQBTableBody = document.getElementById("CQQBTableBody");
			
			var item;
			for (item = 0; item < newData.questions.length; item++) {
				
				var difficulty;
				var difficultyClass;
				if(newData.questions[item].difficulty === '1') {
					difficulty= "Easy";
					difficultyClass = "easyDifficulty";
				}
				else if(newData.questions[item].difficulty === '2') {
					difficulty = "Medium";
					difficultyClass = "mediumDifficulty";
				}
				else if(newData.questions[item].difficulty === '3') {
					difficulty = "Hard";
					difficultyClass = "hardDifficulty";
				}
				
				CQQBTableBody.innerHTML += "<tr><td class='left'>"+newData.questions[item].questionText+"</td><td class='centered'>"+newData.questions[item].topic+"</td><td class='"+difficultyClass+" centered'>"+difficulty+"</td></tr>";
			}
		}
	});
}

function filterEditTopic(option) {
	"use strict"; // Avoids error message
	//var filterValues2 = document.getElementById('filterValues2');
	
	if (option === 'none') {
		var topicValue = filterTopic;
		filterTopic = 'none';
		//filterValues2.innerHTML = "Selected: "+filterTopic+", "+filterDifficulty;
		console.log("REMOVED:"+topicValue);
		console.log("AFTERADD: "+"T:"+filterTopic+"D:"+filterDifficulty);
	}
	else {
		filterTopic = option;
		//filterValues2.innerHTML = "Selected: "+filterTopic+", "+filterDifficulty;
		console.log("ADDED:"+option);
		console.log("AFTERADD: "+"T:"+filterTopic+"D:"+filterDifficulty);
	}
}

function filterEditDifficulty(option) {
	"use strict"; // Avoids error message
	//var filterValues2 = document.getElementById('filterValues2');
	
	if (option === 'none') {
		var difficultyValue = filterDifficulty;
		filterDifficulty = 'none';
		//filterValues2.innerHTML = "Selected: "+filterTopic+", "+filterDifficulty;
		console.log("REMOVED:"+difficultyValue);
		console.log("AFTERADD: "+"T:"+filterTopic+"D:"+filterDifficulty);
	}
	else {
		filterDifficulty = option;
		//filterValues2.innerHTML = "Selected: "+filterTopic+", "+filterDifficulty;
		console.log("ADDED:"+option);
		console.log("AFTERADD: "+"T:"+filterTopic+"D:"+filterDifficulty);
	}
}

function releaseExam() {
	"use strict"; // Avoids error message
	splitScreen.innerHTML = "<div id='releaseExamDiv' class='centered'><h1 class='instructorHeadings'>Exams</h1><br><div id='allExamsDiv'><form id='selectEForm'></form></div></div>";
	
	var allExamsDiv = document.getElementById('allExamsDiv');
	var instructorMainForm = document.getElementById('instructorMainForm');
	var fData = new FormData(instructorMainForm);
	
	fetch('instructorReleaseExam.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'error') {
			allExamsDiv.innerHTML = "ERROR GETTING LIST OF EXAMS";
		}
		else if (newData === 'loggedOut') {
			window.location.replace("index.html");
		}
		else{
			var item;
			var eArray = newData.exams;
			for (item = 0; item < newData.exams.length; item++) {
				selectEForm.innerHTML += "<input type='radio' name='pickedE' value="+newData.exams[item].examId+"><br><label class='filterLabels'>"+newData.exams[item].examName+"</label><br>";
				//<input type='hidden' name='examID' value="+newData.exams[item].examId+">
			}
			selectEForm.innerHTML += "<br><button type='button' id='radioEButton' class='button whiteFont' onclick='releaseRadioExam()'>Release exam</button><br><p id='radioResult'></p>";
		}
	});
}

function releaseGrade() {
	"use strict"; // Avoids error message
	splitScreen.innerHTML = "<div id='releaseGExamDiv' class='centered'><h1 id='RGHeading' class='instructorHeadings'>Exams</h1><br><div id='gradedExamsDiv'><form id='selectGEForm'></form><p id='gError'></p></div></div>";
	
	var gradedExamsDiv = document.getElementById('gradedExamsDiv');
	var gError = document.getElementById('gError');
	var selectGEForm = document.getElementById('selectGEForm');
	
	var instructorMainForm = document.getElementById('instructorMainForm');
	var fData = new FormData(instructorMainForm);
	fetch('instructorReleaseGrade.php', { // Get (middle) graded unreleased (grade) exams
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'error') {
			gError.innerHTML = "ERROR GETTING EXAMS";
		}
		else if (newData === 'loggedOut') {
			window.location.replace("index.html");
		}
		else{
			//console.log(newData.examInstances);
			var item;
			for (item = 0; item < newData.examInstances.length; item++) {
				if (newData.examInstances[item].gradeReleased === "false") {
					var examAndStudentId = newData.examInstances[item].studentId+","+newData.examInstances[item].examId;
					
					selectGEForm.innerHTML += "<input type='radio' name='examInfo' value="+examAndStudentId+"><br><label class='filterLabels'>Exam: "+newData.examInstances[item].examName+"</label><br><label class='filterLabels'>Student: "+newData.examInstances[item].studentId+"</label><br>";
				}
			}
			selectGEForm.innerHTML += "<br><button type='button' id='radioAdjustEButton' class='button whiteFont' onclick='radioAdjustExam()'>Adjust exam</button><br>";
		}
	});
}

function submitQuestion() {
	"use strict"; // Avoids error message
	
	var error = document.getElementById('error');
	var onlyAddQForm = document.getElementById('addQForm');
	var questionsListDiv = document.getElementById('questionsListDiv');
	
	var fData = new FormData(onlyAddQForm);
	
	fetch('instructorAddQ.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'empty') {
			error.innerHTML = "Please fill in all fields.";
		}
		else if (newData === 'loggedOut') {
			window.location.replace("index.html");
		}
		else{
			var instructorMainForm = document.getElementById('instructorMainForm');
			var fData = new FormData(instructorMainForm);

			fetch('instructorShowQ.php', {
				method: 'POST',
				body: fData
			})
			.then( res => res.json()) // Once we have a response
			.then (newData => { // Data from response ^
				if(newData === 'error') {
					error.innerHTML = "ERROR DISPLAYING QUESTIONS LIST";
				}
				else if (newData === 'loggedOut') {
					window.location.replace("index.html");
				}
				else{
					error.innerHTML = "Question created!";
					questionsListDiv.innerHTML = ""; // Refresh Added Questions Div
					questionsListDiv.innerHTML += "<table><thead><tr><th>&nbsp;Question&nbsp;</th><th>&nbsp;Topic&nbsp;</th><th>&nbsp;Difficulty&nbsp;</th></tr></thead><tbody id='CQQBTableBody'></tbody><tfoot></tfoot></table><br>";
			
					var CQQBTableBody = document.getElementById("CQQBTableBody");

					var item;
					for (item = 0; item < newData.questions.length; item++) {
						var difficulty;
						var difficultyClass;
						if(newData.questions[item].difficulty === '1') {
							difficulty= "Easy";
							difficultyClass = "easyDifficulty";
						}
						else if(newData.questions[item].difficulty === '2') {
							difficulty = "Medium";
							difficultyClass = "mediumDifficulty";
						}
						else if(newData.questions[item].difficulty === '3') {
							difficulty = "Hard";
							difficultyClass = "hardDifficulty";
						}

						CQQBTableBody.innerHTML += "<tr><td class='left'>"+newData.questions[item].questionText+"</td><td class='centered'>"+newData.questions[item].topic+"</td><td class='"+difficultyClass+" centered'>"+difficulty+"</td></tr>";
					}
				}
			});
		}
	});
	
}

function releaseRadioExam() {
	"use strict"; // Avoids error message
	var onlyReleaseExamForm = document.getElementById('selectEForm');
	var fData = new FormData(onlyReleaseExamForm);
	var radioResult = document.getElementById('radioResult');
	
	for (var value of fData.values()) {
		console.log("Here!");
		console.log("fData: "+value);
	}
	
	fetch('instructorSubmitRelease.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'Please choose an exam') {
			radioResult.innerHTML = "Please choose an exam.";
		}
		else if (newData === 'loggedOut') {
			window.location.replace("index.html");
		}
		else{ 
			radioResult.innerHTML = "Exam released!";
		}
	});
}

function radioAdjustExam() {
	"use strict"; // Avoids error message
	
	var onlyReleaseGradedExamForm = document.getElementById('selectGEForm');
	var RGHeading = document.getElementById("RGHeading");
	var fData = new FormData(onlyReleaseGradedExamForm);
	var gError = document.getElementById('gError');
	
	for (var pair of fData.entries()) { // Test this to see if examId and studentId transfer over
		console.log("P1:"+pair[0]+",P2:"+pair[1]);
	}
	
	fetch('instructorViewGradedExam.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		console.log("Focus:"+newData.questions);
		if(newData === 'empty') {
			gError.innerHTML = "Please choose an exam.";
		}
		else if (newData === 'loggedOut') {
			window.location.replace("index.html");
		}
		else{
			RGHeading.innerHTML = "Report";
			gError.innerHTML = "";
			onlyReleaseGradedExamForm.innerHTML = "";
			if (newData.gradeReleased === "false") {
				onlyReleaseGradedExamForm.innerHTML += "<table><thead><tr><th>&nbsp;Question&nbsp;</th><th>&nbsp;Student's answer&nbsp;</th><th>&nbsp;Total points&nbsp;</th><th>&nbsp;Adjustment&nbsp;</th><th>&nbsp;Adjustment reason&nbsp;</th><th>&nbsp;Comment&nbsp;</th><th>&nbsp;Points breakdown&nbsp;</th></tr></thead><tbody id='RGAGTableBody'></tbody><tfoot></tfoot></table><br><br><button type='button' id='submitAdjustmentsButton' class='button whiteFont' onclick='submitExamAdjustments()'>Submit adjustments</button><br><p id='submitAdjustmentsResult'></p>";
			
				var RGAGTableBody = document.getElementById("RGAGTableBody");

				var item;
				for (item = 0; item < newData.questions.length; item++) {
					var questionId = newData.questions[item].questionId;
					
					RGAGTableBody.innerHTML += "<tr><td class='left'>"+newData.questions[item].questionText+"</td><td class='left'>"+newData.questions[item].answerText+"</td><td class='left'>"+newData.questions[item].grade+"</td><td><input type='text' name='adjustments[]' placeholder='Adjustment' size='9'></td><td><input type='text' name='adjustmentReasons[]' placeholder='Adjustment reason' size='15'></td><td><input type='text' name='comments[]' placeholder='Comment' size='7'></td><td><table><thead><tr><th>&nbsp;Points&nbsp;</th><th>&nbsp;Reason&nbsp;</th></tr></thead><tbody id='forQ"+questionId+"'></tbody><tfoot></tfoot></table></td></tr>";
					
					var forQ = document.getElementById("forQ"+questionId);
					
					var pb;
					for (pb = 0; pb < newData.questions[item].pointBreakdown.length; pb++) {
						if (newData.questions[item].pointBreakdown[pb].points[0] === "0") {
							forQ.innerHTML += "<tr><td class='redHighlight'>"+newData.questions[item].pointBreakdown[pb].points+"</td><td class='left'>"+newData.questions[item].pointBreakdown[pb].reason+"</td></tr>";
						}
						else {
							forQ.innerHTML += "<tr><td class='greenHighlight'>"+newData.questions[item].pointBreakdown[pb].points+"</td><td class='left'>"+newData.questions[item].pointBreakdown[pb].reason+"</td></tr>";
						}
					}
				}
			}
			else {
				onlyReleaseGradedExamForm.innerHTML = "No exam grades to release.";
			}
		}
	});
}

function submitExamAdjustments() {
	"use strict"; // Avoids error message
	var onlyReleaseGradedExamForm = document.getElementById('selectGEForm');
	var submitAdjustmentsResult = document.getElementById('submitAdjustmentsResult');
	
	var fData = new FormData(onlyReleaseGradedExamForm);
	console.log(fData);
	
	for (var pair of fData.entries()) {
		console.log("P1:"+pair[0]+",P2:"+pair[1]);
	}
	
	fetch('instructorSubmitGraded.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'empty') {
			submitAdjustmentsResult.innerHTML = "EMPTY, DID NOT SUBMIT";
		}
		else if (newData === 'loggedOut') {
			window.location.replace("index.html");
		}
		else{
			submitAdjustmentsResult.innerHTML = "Exam submitted!";
		}
	}); 
}

// Unused
/*
function addTestCase() {
	"use strict"; // Avoids error message
	
	var addQForm = document.getElementById('addQForm');
	
	var br = document.createElement("BR");
	addQForm.appendChild(br);
	
	var input = document.createElement("INPUT");
	input.setAttribute('type', 'text');
	input.setAttribute('name', 'testCaseInput[]');
	input.setAttribute('placeholder', 'Test case input');
    addQForm.appendChild(input);
	
	var br = document.createElement("BR");
	addQForm.appendChild(br);
	
	var input = document.createElement("INPUT");
	input.setAttribute('type', 'text');
	input.setAttribute('name', 'testCaseOutput[]');
	input.setAttribute('placeholder', 'Test case output');
    addQForm.appendChild(input);
}

function delTestCase() {
	"use strict"; // Avoids error message
	
	var addQForm = document.getElementById('addQForm');
	
	var i = 0;
	for (i; i < 4; i++) {
		console.log("LAST:"+addQForm.lastChild.nodeName);
		if (addQForm.lastChild.nodeName !== "#text") {
			addQForm.removeChild(addQForm.lastChild);
		}
	}
}

function deleteQuestion() {
	"use strict"; // Avoids error message
	
	var deleteQForm = document.getElementById('deleteQForm');
	var deleteQResult = document.getElementById('deleteQResult');
	var fData = new FormData(deleteQForm);
	
	// Check the if the form data is correct
	for (var pair of fData.entries()) {
		console.log("P1:"+pair[0]+" "+"P2:"+pair[1]);
	}
	
	fetch('instructorDeleteQ.php', {
		method: 'POST',
		body: fData
	})
	.then( res => res.json()) // Once we have a response
	.then (newData => { // Data from response ^
		if(newData === 'empty') {
			deleteQResult.innerHTML = "Please select a question to delete.";
		}
		else{
			deleteQResult.innerHTML = "Successfully deleted";
			// Refresh questions list
			var instructorMainForm = document.getElementById('instructorMainForm');
			var fData = new FormData(instructorMainForm);

			fetch('instructorShowQ.php', {
				method: 'POST',
				body: fData
			})
			.then( res => res.json()) // Once we have a response
			.then (newData => { // Data from response ^
				if(newData === 'error') {
					error.innerHTML = "ERROR DISPLAYING QUESTIONS LIST";
				}
				else{
					deleteQForm.innerHTML = ""; // Refresh Added Questions Div
					var item;
					for (item = 0; item < newData.questions.length; item++) {
						deleteQForm.innerHTML += "<input type='radio' name='pickedDQ' value="+newData.questions[item].questionId+">"+"Prompt: "+newData.questions[item].questionText+"<br>Question ID: "+newData.questions[item].questionId+"<br>Required function name: "+newData.questions[item].functionName+"<br>Topic: "+newData.questions[item].topic+"<br>Difficulty: "+newData.questions[item].difficulty+"<br><br>";
					}
					deleteQForm.innerHTML += "<button type='button' id='deleteQButton' onclick='deleteQuestion()'>Delete</button><p id='deleteQResult'>Result: </p>";
				}
			});
		}
	});
}
*/