<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST["username"];
    $pwd = $_POST["pwd"];
    $email = $_POST["email"];

    try {
        require_once "../general/dbh.php";
        require_once "../general/session.conf.php";
        require_once "signin_contr.php";
        require_once "signin_model.php";
        require_once "signin_view.php";
        //error handlers
        $errors = [];

        if (missing_input($username, $pwd, $email)) {
            $errors["missing_input"] = "Please fillout al fields"; 
        }

        if ($email && invalid_email($email)) {
            $errors["invalid_email"] = "invalid email format";    
        }
        

        if ($username && username_taken($pdo, $username)) {
            $errors["username_taken"] = "username already taken";
        }

        if (!missing_input($username, $pwd, $email) && $pwd && short_pwd($pwd)) {
            $errors["password_too_short"] = "Password must be at least 4 characters long";
        }

        if ($errors) {
            $_SESSION["signin_errors"] = $errors;
            header("location: ../../signin_f/signin_page.php");
            die();
        }

        // if no errors then we will store information in database.
        save_account($pdo, $username, $pwd, $email);

        header("location: ../../signin_f/signin_page.php?account_created=true");
    } catch(PDOException $e) {
        die("Error in signin_php: " . $e->getMessage());
    }
} else {
    header("location: ../../signin_f/signin_page.php");
}