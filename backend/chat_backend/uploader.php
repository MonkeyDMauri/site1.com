<?php


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    header("Content-Type:application/json");
    
    // check the $_FILES variable is not empty and that the image sent has a name.
    if (isset($_FILES["file"]) && $_FILES["file"]["name"] != " ") {
        // if the error for the image is not zero then something went wrong otherwise the
        // next code will be executed.
        if ($_FILES["file"]["error"] === 0) {

            //create folder in case it doenst exist.
            $folder = "uploads/";
            if (!file_exists($folder)) {
                mkdir($folder, 0777, true);
            }
            // set destination for images.
            $destination = $folder . $_FILES["file"]["name"];
            // ipload images.
            move_uploaded_file($_FILES["file"]["tmp_name"], $destination);

            // send response bac to javascript file.
            echo json_encode([
                "success" => true,
                "result" => $_FILES["file"],
                "picName" => $_FILES["file"]["name"]
            ]);
        } else {
            echo json_encode([
                "error" => "error in uploader.php"
            ]);
        }
    }
} else {
    header("location: ../../chat_f/chat_page.php");
}