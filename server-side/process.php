<?php
require_once('db.php');

if (isset($_GET['combo'])){
	if (isset($_GET['token'])){
		$token = $_GET['token'];
	} else {
		die('No token');
	}
	$combo = $_GET['combo'];
	
	$result = $db->prepare("SELECT combo FROM combos WHERE token=? LIMIT 1");
	$result->bind_param('s', $token);
	$result->execute();
	$result->store_result();
	$result->bind_result($corCombo);
	if ($result->num_rows > 0){
		$result->fetch();
		$result->free_result();
	} else {
		die('Confirmation failed. No combo.');
	}
	
	//$result = $db->prepare("SELECT id FROM payments ORDER BY id DESC LIMIT 1");
	$result = $db->prepare("SELECT id,location FROM payments WHERE token=? ORDER BY id DESC LIMIT 1");
	$result->bind_param('s', $token);
	$result->execute();
	$result->store_result();
	$result->bind_result($paymentID, $paymentLocation);
	$result->fetch();
	$result->free_result();

	if ($combo == $corCombo){
		if ($paymentLocation == 'Atlanta, GA'){
			$result = $db->prepare("UPDATE payments SET confirmed='1' WHERE id=? LIMIT 1");
			$result->bind_param('i', $paymentID);
			$result->execute();
			$result->free_result();
			echo 'Payment approved';
		} else {
			$result = $db->prepare("UPDATE payments SET confirmed='3' WHERE id=? LIMIT 1");
			$result->bind_param('i', $paymentID);
			$result->execute();
			$result->free_result();
			echo 'Location validation failed';
		}
	} else {
		$result = $db->prepare("UPDATE payments SET confirmed='2' WHERE id=? LIMIT 1");
		$result->bind_param('i', $paymentID);
		$result->execute();
		$result->free_result();
		echo 'Confirmation failed';
	}
} else {
	echo 'Error';
}

?>