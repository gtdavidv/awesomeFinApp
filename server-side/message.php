<?php
require_once('db.php');

$result = $db->prepare("SELECT id,time,amount,location FROM payments WHERE shown=0 AND confirmed=0 ORDER BY id DESC LIMIT 1");
$result->execute();
$result->store_result();
$result->bind_result($paymentID, $paymentTime, $paymentAmount, $paymentLocation);
if ($result->num_rows > 0){
	$result->fetch();
	$result->free_result();

	echo 'Payment confirmation request:
$'.$paymentAmount.' from '.$paymentLocation;

	$result = $db->prepare("UPDATE payments SET shown='1' WHERE id='$paymentID' LIMIT 1");
	$result->execute();
	$result->free_result();
} else {
	die();
}
?>