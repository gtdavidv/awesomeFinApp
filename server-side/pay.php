<?php
require_once('db.php');

if (!isset($_POST['amount'])){
	if (isset($_GET['token'])){
		$token = $_GET['token'];
	} else {
		$token = '88fc69de2c98e42298f94bf48e55a30';
	}
	?>
	<form action="" method="post">
		<div>
			Payment amount: $<input type="text" name="amount" /><br />
			Location: <input type="text" name="location" /><br />
			Token: <input type="text" name="token" value="<?php echo $token; ?>" /><br />
			<input type="submit" value="Submit payment" />
		</div>
	</form>
	<?php
} else {
	$paymentAmount = $_POST['amount'];
	$paymentLocation = $_POST['location'];
	$time = time();
	$token = '88fc69de2c98e42298f94bf48e55a30';
	
	$result = $db->prepare("INSERT INTO payments (time, amount, location, token) VALUES (?, ?, ?, ?)");
	$result->bind_param('isss', $time, $paymentAmount, $paymentLocation, $token);
	$result->execute();
	$result->free_result();
	
	echo 'Payment processed';
}
?>