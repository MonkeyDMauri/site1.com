<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST["username"];
    $pwd = $_POST["pwd"];

    try {

        require_once "../general/dbh.php";
        require_once "../general/session.conf.php";
        require_once "./login_contr.php";
        require_once "./login_model.php";

        // getting a user who's name matches with $username.
        $user = get_user($pdo, $username);

        // error handlers
        $errors = [];

        if (missing_input($username, $pwd)) {
            $errors["missing_input"] = "Please fill out all fields";
        }

        if ($username && $pwd && wrong_username($user)) {
            $errors["wrong_username"] = "Account doesnt exit.";
        }

        if (!wrong_username($user) && wrong_password($pwd, $user["pwd"])) {
            $errors["wrong_password"] = "Wrong password";
        }

        if ($errors) {
            $_SESSION["login_errors"] = $errors;
            header("location: ../../login_f/login_page.php");
            die();
        }

        // if no errors and verification is succesful, user will be sent to
        // chat page.

        header("location: ../../chat_f/chat_page.php");
    } catch(PDOException $e) {
        echo "error";
        die("Error in /backend/login_backend/login.php" . $e->getMessage());
    }
}