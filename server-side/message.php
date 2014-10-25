<?php
require_once('db.php');

/*
if (isset($_GET['token'])){
	$token = $_GET['token'];
	
	$result = $db->prepare("SELECT id FROM combos WHERE token=? LIMIT 1");
	$result->bind_param('s', $token);
	$result->execute();
	$result->store_result();
	if ($result->num_rows == 0){
		die('No combo');
	}
	$result->free_result();
} else {
	die();
}
*/

//$result = $db->prepare("SELECT id,time,amount,location FROM payments WHERE token=? ORDER BY id DESC LIMIT 1");
$result = $db->prepare("SELECT id,time,amount,location,confirmed FROM payments ORDER BY id DESC LIMIT 1");
$result->bind_param('s', $token);
$result->execute();
$result->store_result();
$result->bind_result($paymentID, $paymentTime, $paymentAmount, $paymentLocation, $confirmed);
if ($result->num_rows > 0){
	$result->fetch();
	$result->free_result();

	if ($confirmed == 0){
		$paymentAmount = money_format('%i', $paymentAmount);
		echo 'Payment confirmation request:
$'.$paymentAmount.' from '.$paymentLocation;
	}

	/*
	$result = $db->prepare("UPDATE payments SET shown='1' WHERE id='$paymentID' LIMIT 1");
	$result->execute();
	$result->free_result();
	*/
} else {
	die();
}
?>