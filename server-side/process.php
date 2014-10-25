<?php
require_once('db.php');

if (isset($_GET['combo'])){
	$combo = $_GET['combo'];
	
	$result = $db->prepare("SELECT id FROM payments ORDER BY id DESC LIMIT 1");
	$result->execute();
	$result->store_result();
	$result->bind_result($paymentID);
	$result->fetch();
	$result->free_result();

	if ($combo == 'TTDD'){
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
		echo 'Confirmation failed';
	}
} else {
	echo 'Error';
}

?>