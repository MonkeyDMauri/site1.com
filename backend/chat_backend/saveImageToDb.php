<?php

// code to add pic name to DB.

if($_SERVER["REQUEST_METHOD"] === "POST") {
    header("Content-Type:application/json");
    $input = json_decode(file_get_contents("php://input"), true);
    $picName = $input["fileName"];

    try {
        require_once "../general/dbh.php";
        require_once "../general/session.conf.php";

        $query = "UPDATE users SET image = :destination WHERE id = :id;";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(":id", $_SESSION["user_id"]);
        $stmt->bindParam(":destination", $picName);
        $stmt->execute();

        $pdo = null;
        $stmt = null;

        echo json_encode([
            "success" => true,
            "name" => $picName
        ]);
    } catch(PDOException $e) {
        echo json_encode([
            "error" => "Error in uploader: " . $e->getMessage()
        ]);
    }
} else {
    header("location: ../../chat_f/chat_page.php");
}


