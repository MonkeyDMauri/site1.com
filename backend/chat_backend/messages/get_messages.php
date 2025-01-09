<?php


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    header("Content-Type:application/json");

    //getting selected contact id.
    $input = json_decode(file_get_contents("php://input"), true);
    $contact_id = $input["contact_id"];
    $userId = $input["userId"];

    try {
        require_once "../../general/dbh.php";
        require_once "../../general/session.conf.php";

        $query = "SELECT * FROM messages WHERE sender = :sender && receiver = :receiver;";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(":sender", $userId);
        $stmt->bindParam(":receiver", $contact_id);
        $stmt->execute();
        

        // fetching result.
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        // verifying if data was actually retreived so we can send a proper response to promise.

        if ($result) {
            echo json_encode([
                "success" => true,
                "sender" => $userId,
                "receiver" => $contact_id
            ]);
        } else {
            echo json_encode([
                "empty" => true,
                "sender" => $userId,
                "receiver" => $contact_id
            ]);
        }
    } catch(PDOException $e) {
        echo json_encode([
            "error" => "error in promise " . $e->getMessage()
        ]);
    }


}