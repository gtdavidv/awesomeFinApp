<?php
require_once('db.php');

$tmpID = 1;

$result = $db->prepare("SELECT testCount FROM test WHERE id=? LIMIT 1");
$result->bind_param('i', $tmpID);
$result->execute();
$result->store_result();
$result->bind_result($testCount);
$result->fetch();
echo $testCount;
$result->free_result();

$newCount = $testCount + 1;
$result = $db->prepare("UPDATE test SET testCount=$newCount WHERE id='1' LIMIT 1");
$result->execute();
$result->free_result();
?>