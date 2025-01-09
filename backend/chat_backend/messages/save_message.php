<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    header("Content-Type:application/json");
    $input = json_decode(file_get_contents("php://input"), true);
    $message = $input["message"];
    $receiver = $input["receiver"];
    $date = $input["date"];
    $mssgid = $input["mssgid"];
    $senderUsername = $input["senderUsername"];

    try {
        require_once "../../general/dbh.php";
        require_once "../../general/session.conf.php";

        // first will need to get the current user ID.
        $query1 = "SELECT id FROM users WHERE username = ?;";
        $stmt = $pdo->prepare($query1);
        $stmt->execute([$senderUsername]);
        $sender = $stmt->fetchColumn();


        // saving message info into messages table.
        $query = "INSERT INTO messages(sender, receiver, message, date, mssgid) 
                 VALUES(:sender, :receiver, :message, :date, :mssgid);";

        $stmt = $pdo->prepare($query);
        $stmt->bindParam(":sender", $sender);
        $stmt->bindParam(":receiver", $receiver);
        $stmt->bindParam(":message", $message);
        $stmt->bindParam(":date", $date);
        $stmt->bindParam(":mssgid", $mssgid);

        $stmt->execute();


        echo json_encode([
            "success" => true,
            "result" => $message
        ]);
    } catch(PDOException $e) {
        echo json_encode([
            "error" => $e->getMessage()
        ]);
    }
}

// CREATE TABLE messages (
//     id BIGINT PRIMARY KEY AUTO_INCREMENT,
//     mssgid VARCHAR(60),
//     sender BIGINT,
//     receiver BIGINT,
//     message TEXT,
//     files TEXT,
//     date DATETIME,
//     seen INT DEFAULT 0,
//     received INT DEFAULT 0,
//     deleted_sender TINYINT DEFAULT 0,
//     deleted_receiver TINYINT DEFAULT 0
// );