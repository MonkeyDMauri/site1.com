<?php


function missing_input($username, $pwd, $email) {
    if (empty($username) || empty($pwd) || empty($email)) {
        return true;
    }
}

function invalid_email($email) {
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return true;
    }

 }

function username_taken(object $pdo, $username) {

    if (get_username($pdo, $username)) {

        return true;
    }
 
}


function short_pwd(string $pwd){

    if (mb_strlen($pwd, "utf8") < 4) {
        return true;
    }    
}