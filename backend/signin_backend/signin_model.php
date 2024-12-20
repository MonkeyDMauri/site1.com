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
