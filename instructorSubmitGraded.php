<?php
// cURL in PHP

session_start();

if ($_SESSION['loggedIn'] == 'false') {
	echo json_encode('loggedOut');
}
else {
	$studentId = $_SESSION['studentId'];
	$examId = $_SESSION['examId'];
	$questionIds = $_SESSION['questionIds'];
	$adjustments = $_POST['adjustments'];
	$adjustmentReasons = $_POST['adjustmentReasons'];
	$comments = $_POST['comments'];

	if(empty($adjustments) || empty($adjustmentReasons) || empty($comments)) { // Detect if error
		echo json_encode('empty');
	}
	else { // Send data using cURL
		$formData;
		$formData->studentId = $studentId;
		$formDat->examId = $examId;
		$formData->questionIds = $questionIds;
		$formData->adjustments = $adjustments;
		$formData->adjustmentReasons = $adjustmentReasons;
		$formData->comments = $comments;

		$formDataJSON = json_encode($formData);

		$cSession = curl_init();
		curl_setopt($cSession, CURLOPT_URL, "https://web.njit.edu/~tmd24/CS490/api/v1/submitAdjustmentsComments.php");
		curl_setopt($cSession, CURLOPT_POST, TRUE);
		curl_setopt($cSession, CURLOPT_POSTFIELDS, $formDataJSON);
		curl_setopt($cSession, CURLOPT_RETURNTRANSFER, TRUE);
		$cResult = curl_exec($cSession);
		curl_close($cSession);
		echo json_encode('good');
	}
}
?>