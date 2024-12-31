<?php

// code to add pic name to DB.

if($_SERVER["REQUEST_METHOD"] === "POST") {
    header("Content-Type:application/json");
    $input = json_decode(file_get_contents("php://input"), true);
    $picName = $input["fileName"];

    try {
        require_once "../general/dbh.php";
        require_once "../general/session.conf.php";

        $query = "UPDATE users SET img = :destination WHERE username = :username;";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(":destination", $picName);
        $stmt->bindParam(":username", $_SESSION["user_username"]);
        $stmt->execute();

        if ($stmt->rowCount() === 0) {
            error_log("No rows updated. User ID might not exist or data didn't change.");
            echo json_encode(["error" => "Update failed."]);
            exit;
        }

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


