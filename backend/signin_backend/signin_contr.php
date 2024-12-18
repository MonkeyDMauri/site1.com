<?php


function missing_input($username, $pwd, $email) {
    if (empty($username) || empty($pwd) || empty($email)) {
        return true;
    }
}