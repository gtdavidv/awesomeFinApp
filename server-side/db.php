<?php
$db = new mysqli('mysql09.powweb.com', 'finapp', 'finapp', 'finapp');
if ($db->connect_errno > 0){
	die('Unable to connect to database ('.$db->connect_error.']');
}
?>