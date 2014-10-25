<?php
require_once('db.php');

if (isset($_GET['combo'])){
	if (isset($_GET['token'])){
		$token = $_GET['token'];
	} else {
		die();
	}
	$combo = $_GET['combo'];
	
	$result = $db->prepare("SELECT id FROM payments WHERE token=? ORDER BY id DESC LIMIT 1");
	$result->bind_param('s', $token);
	$result->execute();
	$result->store_result();
	$result->bind_result($paymentID);
	$result->fetch();
	$result->free_result();

	if ($combo == 'ttbb'){
		$result = $db->prepare("UPDATE payments SET confirmed='1' WHERE id=? LIMIT 1");
		$result->bind_param('i', $paymentID);
		$result->execute();
		$result->free_result();
		echo 'Payment approved';
	} else {
		$result = $db->prepare("UPDATE payments SET confirmed='2' WHERE id=? LIMIT 1");
		$result->bind_param('i', $paymentID);
		$result->execute();
		$result->free_result();
		echo 'Confirmation failed. '.$combo;
	}
} else {
	echo 'Error';
}

?>