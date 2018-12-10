<?php
// cURL in PHP
session_start();

if ($_SESSION['loggedIn'] == 'false') {
	echo json_encode('loggedOut');
}
else {
	$answerText = $_POST['studentAnswerText'];
	$questIds = $_POST['questIds']; 

	if(empty($questIds)) { // If no answers were given
		echo json_encode('empty');
	}
	else { // Send data using cURL
		$formData;
		$formData->studentId = $_SESSION['studentId'];
		$formData->answerText = $answerText;
		$formData->questIds = $questIds;
		$formData->examId = $_SESSION['examId'];

		$formDataJSON = json_encode($formData);

		$cSession = curl_init();
		curl_setopt($cSession, CURLOPT_URL, "https://web.njit.edu/~tmd24/CS490/api/v1/submitAnswers.php");
		curl_setopt($cSession, CURLOPT_POST, TRUE);
		curl_setopt($cSession, CURLOPT_POSTFIELDS, $formDataJSON);
		curl_setopt($cSession, CURLOPT_RETURNTRANSFER, TRUE);
		$cResult = curl_exec($cSession);
		curl_close($cSession);
		echo json_encode('true');
		//echo $cResult;
	}
}
?>