<?php
require_once('db.php');

if (isset($_GET['combo'])){
	$combo = $_GET['combo'];
} else {
	die();
}

if (isset($_GET['token'])){
	$token = $_GET['token'];
} else {
	die();
}

$result = $db->prepare("INSERT INTO combos (combo, token) VALUES (?, ?)")
$result->bind_param('ss', $combo, $token);
$result->execute();
$result->free_result();

echo 'New combo successfully set';
?>