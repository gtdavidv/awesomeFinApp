<?php
require_once('db.php');

if (!isset($_POST['amount'])){
	?>
	<form action="" method="post">
		<div>
			Payment amount: $<input type="text" name="amount" /><br />
			Location: <input type="text" name="location" /><br />
			<input type="submit" value="Submit payment" />
		</div>
	</form>
	<?php
} else {
	$paymentAmount = $_POST['amount'];
	$paymentLocation = $_POST['location'];
	$time = time();
	
	$result = $db->prepare("INSERT INTO payments (time, amount, location) VALUES (?, ?, ?)");
	$result->bind_param('iss', $time, $paymentAmount, $paymentLocation);
	$result->execute();
	$result->free_result();
	
	echo 'Payment processed';
}
?>