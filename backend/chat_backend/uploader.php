<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    header("Content-Type:application/json");

    if (isset($_FILES["file"]) && $_FILES["file"]["name"] != " ") {

        if ($_FILES["file"]["error"] === 0) {

            $folder = "uploads/";
            if (!file_exists($folder)) {
                mkdir($folder, 0777, true);
            }

            $destination = $folder . $_FILES["file"]["name"];
            move_uploaded_file($_FILES["file"]["tmp_name"], $destination);

            echo json_encode([
                "success" => true,
                "result" => $_FILES["file"]
            ]);
        } else {
            echo json_encode([
                "error" => "file contains an error, error != 0"
            ]);
        }
    } else {
        echo json_encode([
            "error" => "not file was received by uploader.php"
        ]);
    }
} else {
    header("location: ../../chat_f/chat_page.php");
}