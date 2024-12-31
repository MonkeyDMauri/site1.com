<?php

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    header("Content-Type:application/json");

    require_once "../general/dbh.php";
    require_once "../general/session.conf.php";

    $query = "SELECT * FROM users WHERE username = :username;";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(":username", $_SESSION["user_username"]);
    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "username" => $result["username"],
        "email" => $result["email"],
        "result" => $result
    ]);

    $pdo = null;
    $stmt = null;
} else{
    header("location: ../../login_f/login_page.php");
}