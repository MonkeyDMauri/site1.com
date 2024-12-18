<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST["username"];
    $pwd = $_POST["pwd"];
    $email = $_POST["email"];

    try {
        require_once "../general/dbh.php";
        require_once "../general/session.conf.php";
        require_once "signin_contr.php";
        //error handlers
        $errors = [];

        if (missing_input($username, $pwd, $email)) {
            $errors["missing_input"] = "Please fillout al fields"; 
        }

        if ($errors) {
            echo "missing input";
            die();
        }

        echo "no errors";
    } catch(PDOException $e) {
        die("Error in signin_php: " . $e->getMessage());
    }
} else {
    header("location: ../../signin_f/signin_page.php");
}