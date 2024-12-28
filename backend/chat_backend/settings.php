<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST["username"];
    $email = $_POST["email"];
    $gender = $_POST["gender"];
    $pwd = $_POST["pwd"];
    $pwd2 = $_POST["pwd2"];
    
    try {
        require_once "../general/dbh.php";
        require_once "../general/session.conf.php";

        echo "test";
    } catch(PDOException $e) {
        die("Error in settings.php: " . $e->getMessage());
    }
} else {
    header("location: ../../chat_f/chat_page.php");
}
