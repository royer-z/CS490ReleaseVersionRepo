<?php
// cURL in PHP
session_start();

if ($_SESSION['loggedIn'] == 'false') {
	echo json_encode('loggedOut');
}
else {
	$topicInput= $_POST['topicInput'];
	$difficultyInput= $_POST['difficultyInput'];

	if ($topicInput === 'none' && $difficultyInput === 'none') {
		$formData->action = array();
	}
	elseif ($topicInput !== 'none' && $difficultyInput !== 'none') {
		$formData;
		$formData->topic = $topicInput;
		$formData->difficulty = $difficultyInput;
	}
	elseif ($topicInput !== 'none' && $difficultyInput === 'none') {
		$formData;
		$formData->topic = $topicInput;

	}
	elseif ($topicInput === 'none' && $difficultyInput !== 'none') {
		$formData;
		$formData->difficulty = $difficultyInput;

	}

	$formDataJSON = json_encode($formData);

	$cSession = curl_init();
	curl_setopt($cSession, CURLOPT_URL, "https://web.njit.edu/~tmd24/CS490/api/v1/getQuestionList.php");
	curl_setopt($cSession, CURLOPT_POST, TRUE);
	curl_setopt($cSession, CURLOPT_POSTFIELDS, $formDataJSON);
	curl_setopt($cSession, CURLOPT_RETURNTRANSFER, TRUE);
	$cResult = curl_exec($cSession);
	curl_close($cSession);
	echo $cResult;
}
?>