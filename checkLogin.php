<?php
session_start();

if ($_SESSION['loggedIn'] == 'false') {
	echo json_encode('loggedOut');
}
else {
	echo json_encode('loggedIn');
}
?>