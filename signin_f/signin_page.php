<?php
require_once "../backend/general/session.conf.php";
require_once "../backend/signin_backend/signin_view.php";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signin</title>
    <link rel="stylesheet" href="signin_style.css">
    <link rel="stylesheet" href="signin_media.css">
</head>
<body>
    <div class="signin-wrapper">
        <div>
            <h1 class="logo">Maubook</h1>
            <div class="signin-wrap">
                <h1 style="text-align: center;">Sign In</h1>
                <p style="text-align: center; font-weight:400;">create your Maubook account!</p>
                <form action="../backend/signin_backend/signin.php" method="POST">
                    <div class="form-wrap">
                        <input type="text" name="username" placeholder="Username">
                        <input type="text" name="email" placeholder="E-mail ">
                        
                        <div>
                            <h2 style="margin:0;">Gender</h2>
                            <Label>Male</Label>
                            <input type="radio" name="gender" value="male" checked>
                            <Label>Female</Label>
                            <input type="radio" name="gender" value="female">
                        </div>

                        <input type="password" name="pwd" placeholder="Password">
                        <div class="signin-btn-wrapper">
                            <button type="submit" class="signin-btn">Signin</button>
                        </div>
                        <p class="already_have_an_account_link"><a href="../login_f/login_page.php">Already have an account?</a></p>
                    </div>
                </form>
            </div>
            <div class="mssg-wrap">
                <?php
                    check_errors();
                ?>
            </div>
        </div>
    </div>
</body>
</html>
