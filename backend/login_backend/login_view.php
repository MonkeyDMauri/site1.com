<?php

function check_errors() {
    if (isset($_SESSION["login_errors"])) {
        $errors = $_SESSION["login_errors"];

        foreach($errors as $error) {
            echo "<div class='mssg'>" . $error . "</div>";
        }

        unset($_SESSION["login_errors"]);
    }
}