<?php
// cURL in PHP
session_start();

if ($_SESSION['loggedIn'] == 'false') {
	echo json_encode('loggedOut');
}
else {
	$examId = $_POST['pickedE'];

	if(empty($examId)) { // Detect if ID form field is empty
		echo json_encode('Please choose an exam');
	}
	else { // Send data using cURL
		$formData;
		$formData->examId = $examId;
		$formData->open = "true";

		$formDataJSON = json_encode($formData);

		$cSession = curl_init();
		curl_setopt($cSession, CURLOPT_URL, "https://web.njit.edu/~tmd24/CS490/api/v1/openCloseExam.php");
		curl_setopt($cSession, CURLOPT_POST, TRUE);
		curl_setopt($cSession, CURLOPT_POSTFIELDS, $formDataJSON);
		curl_setopt($cSession, CURLOPT_RETURNTRANSFER, TRUE);
		$cResult = curl_exec($cSession);
		curl_close($cSession);
		echo $cResult;
	}
}
?>