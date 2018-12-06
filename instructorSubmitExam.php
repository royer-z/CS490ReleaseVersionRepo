<?php
// https://web.njit.edu/~rvz2/instructorSubmitExam.php
// cURL in PHP
session_start();

if ($_SESSION['loggedIn'] == 'false') {
	echo json_encode('loggedOut');
}
else {
	$empty = $_POST['empty'];
	$examName = $_POST['examName'];
	$questionIds = $_POST['pickedQ'];
	$questionPoints = $_POST['questionPoints'];

	if (empty($questionIds)) {
		echo json_encode('emptyIds');
	}
	elseif($empty == 'true') {
		echo json_encode('empty');
	}
	else { // Send data using cURL
		$formData;
		$formData->examName = $examName;
		$formData->questionIds = $questionIds;
		$formData->points = $questionPoints;

		$formDataJSON = json_encode($formData);

		$cSession = curl_init();
		curl_setopt($cSession, CURLOPT_URL, "https://web.njit.edu/~tmd24/CS490/api/v1/createExam.php");
		curl_setopt($cSession, CURLOPT_POST, TRUE);
		curl_setopt($cSession, CURLOPT_POSTFIELDS, $formDataJSON);
		curl_setopt($cSession, CURLOPT_RETURNTRANSFER, TRUE);
		$cResult = curl_exec($cSession);
		curl_close($cSession);
		echo json_encode('good');
	}
}
?>