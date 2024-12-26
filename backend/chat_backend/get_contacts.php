<?php


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $input = json_decode(file_get_contents("php://input"), true);
    $username = $input["username"];

    header("Content-Type:application/json");

    try {

        require_once "../general/session.conf.php";
        require_once "../general/dbh.php";

        // getting user ID.
        $query1 = "SELECT id FROM users WHERE username = :username;";
        $stmt = $pdo->prepare($query1);
        $stmt->bindParam(":username", $username);
        $stmt->execute();

        $id = $stmt->fetchColumn();

        // code to get all contacts except for the one who's ID matches the ID we just
        // retreived using current username.
        $query2 = "SELECT * FROM users WHERE id != :id;";
        $stmt = $pdo->prepare($query2);
        $stmt->bindParam(":id", $id);
        $stmt->execute();


        $result = $stmt->fetch(PDO::FETCH_ASSOC);



        echo json_encode([
            "success" => true,
            "result" => $result
        ]);
    }catch(PDOException $e) {

    }

} else {
    die("Error when accessing this page");
}