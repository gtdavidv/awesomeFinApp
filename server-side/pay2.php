<?php
require_once('db.php');
?>
<html>
<head>
	<title>Cate Simulator</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="css/styles.css">
</head>

<body>
	<div class="container">
		<div class="home">
			<div class="row">
				<div class="col-md-4 col-md-offset-4">
					<!-- the logo slideshow -->
					<div id="slideshow">
						<div>
							<img src="img/cate_0.png">
						</div>
						<div>
							<img src="img/cate_2.png">
						</div>
						<div>
							<img src="img/cate_1.png">
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<!-- the form -->
				<div class= "col-md-4 col-md-offset-4">
<?php
if (!isset($_POST['amount'])){
	if (isset($_GET['token'])){
		$token = $_GET['token'];
	} else {
		$token = '88fc69de2c98e42298f94bf48e55a30';
	}
	?>
	<form action="" method="post" role="form">
		<div>
			<div class="form-group">
				<label for="payment">Payment amount:</label>
				<input type="text" name="amount" class="form-control" placeholder="$0.00" />
			</div>
			<div class="form-group">
				<label for="method">Vendor:</label>
				<input type="text" name="vendor" class="form-control" placeholder="Local retailer" />
			</div>
			<div class="form-group">
				<label for="method">Location:</label>
				<input type="text" name="location" class="form-control" placeholder="City, State" />
			</div>
			<div class="form-group">
				<label for="method">Token:</label>
				<input type="text" name="token" class="form-control" value="<?php echo $token; ?>" />
			</div>
			<input type="submit" class="btn btn-Success" value="Submit payment" />
		</div>
	</form>
	<?php
} else {
	$paymentAmount = str_replace('$', '', $_POST['amount']);
	$paymentLocation = $_POST['location'];
	$paymentVendor = $_POST['vendor'];
	$time = time();
	$token = $_POST['token'];
	
	$result = $db->prepare("INSERT INTO payments (time, amount, vendor, location, token) VALUES (?, ?, ?, ?, ?)");
	$result->bind_param('issss', $time, $paymentAmount, $paymentVendor, $paymentLocation, $token);
	$result->execute();
	$result->free_result();
	
	echo '<div style="text-align: center;">Payment processed!</div>';
	echo '<div style="height: 215px;"></div>';
}
?>
</div>
			</div>
		</div>
	</div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
<script type="text/javascript">
	$( document ).ready(function() {
		$("#slideshow > div:gt(0)").hide();

			setInterval(function() { 
			  	$('#slideshow > div:first')
			    .fadeOut(1000)
			    .next()
			    .fadeIn(1000)
			    .end()
			    .appendTo('#slideshow');
				},  3000);
		} 
	);
</script>
</body>
</html>