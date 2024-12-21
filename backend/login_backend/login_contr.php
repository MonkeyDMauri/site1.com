<?php

function missing_input($username, $pwd) {
    if (empty($username) || empty($pwd)) {
        return true;
    }
}

function wrong_username(array|bool $user) {
    if (!$user) {
        return true;
    }
}

function wrong_password($pwd, $hashedPwd) {
    if (!password_verify($pwd, $hashedPwd)) {
        return true;
    }
}