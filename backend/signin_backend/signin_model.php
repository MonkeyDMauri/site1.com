<?php


function get_username($pdo, $username){

   try {
 
      $query = "SELECT username FROM users WHERE username = :username;";
      
      $stmt = $pdo->prepare($query);
      
      $stmt->bindParam(":username", $username);
      
      $stmt->execute();
      
      $result = $stmt->fetch();
 
      if ($result) {
         return true;
      }
    } catch(PDOException $e) {
 
 die("error in signin_model.php: " . $e->getMessage());
 
    }
 
}

function save_account($pdo, $username, $pwd, $email) {

   // MySQL query to insert data into the users table.
   $query = "INSERT INTO users(username, pwd, email) VALUES(:username, :pwd, :email);";

   // creating cursor to execute mysql queries.
   $stmt = $pdo->prepare($query);

   // hashing password before adding it to the users table.
   $option = [
      "cost" => 12
   ];

   $hashedPwd = password_hash($pwd, PASSWORD_BCRYPT, $option);

   // binding placeholder to variables.
   $stmt->bindParam(":username", $username);
   $stmt->bindParam(":pwd", $hashedPwd);
   $stmt->bindParam(":email", $email);

   $stmt->execute();

   // closing connection.
   $stmt = null;
   $pdo =null;
}
