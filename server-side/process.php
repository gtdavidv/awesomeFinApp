<?php
require_once('db.php');

if (isset($_GET['combo'])){
	$combo = $_GET['combo'];
	$paymentID = $_GET['id'];
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