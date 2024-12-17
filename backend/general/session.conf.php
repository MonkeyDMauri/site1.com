<?php

ini_set("session:use_cookies_only", 1);
ini_set("session:use_strict_mode", 1);

session_start();

if (!isset($_SESSION["last_regeneration"])) {
    regenerate();
} else {
    $interval = 10;

    if (time() - $_SESSION["last_regeneration"] >= $interval) {
        regenerate();
    }
}


function regenerate() {
    $_SESSION["last_regeneration"] = time();
    session_regenerate_id(true);
}
?>