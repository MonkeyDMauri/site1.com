<?php

$dsn = "mysql:host=localhost;dbname=site1";
$dbuser = "root";
$dbpassword = "1234";

try {
    $pdo = new PDO($dsn, $dbuser, $dbpassword);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Error in dbh.php: " . $e->getMessage());
}