<?php
require_once('db.php');

if (isset($_GET['error'])){
	$error = $_GET['error'];
	$time = time();
	
	$result = $db->prepare("INSERT INTO error_log (time,text) VALUES (?,?)");
	$result->bind_param('is', $time, $error);
	$result->execute();
	$result->free_result();
}

$result = $db->prepare("SELECT time,text FROM error_log ORDER BY id DESC");
$result->execute();
$result->store_result();
$result->bind_result($errTime, $errText);
while ($result->fetch()){
	echo date('G:i:s', $errTime).': '.$errText.'<div style="height: 1em;"></div>';
}
$result->free_result();
?>