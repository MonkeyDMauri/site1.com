<?php


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //setting data type for response.
    header("Content-Type:application/json");

    //getting input from JSON fetch.
    $input = json_decode(file_get_contents("php://input"), true);
    $contactId = $input["id"];

    try {
        require_once "../general/session.conf.php";
        require_once "../general/dbh.php";

        $query = "SELECT * FROM users WHERE id = :id;";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(":id", $contactId);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "id" => $contactId,
            "result" => $result
        ]);

    } catch(PDOException $e) {
        echo json_encode([
            "error" => "error: " . $e
        ]);
    }
    
} else {
    header("location: ../../chat_f/chat_page.php");
}