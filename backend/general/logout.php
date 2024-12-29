<?php

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    //resuming previous session.
    session_start();
    //unsetting all session variables;
    session_unset();
    //destroying session.
    session_destroy();

    header("Content-Type:application/json");

    echo json_encode([
        "success" => true
    ]);
} else {
    header("location: ../../login_f/login_page.php");
}