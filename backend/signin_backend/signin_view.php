<?php

function check_errors() {
    if (isset($_SESSION["signin_errors"])) {
        $errors = $_SESSION["signin_errors"];

        foreach($errors as $error) {
            echo "<div class='mssg'>" . $error . "</div>";
        }

        unset($_SESSION["signin_errors"]);
    } else if (isset($_GET["account_created"]) && $_GET["account_created"] === "true") {
        echo "<div>Account created successfully!</div>";

    }
}