<?php
require_once "../backend/general/session.conf.php";
require_once "../backend/login_backend/login_view.php";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="./login_style.css">
    <link rel="stylesheet" href="./login_media.css">
    <script src="./login_script.js" defer></script>
</head>
<body>
<div class="signin-wrapper">
        <div>
            <h1 class="logo">Maubook</h1>
            <div class="signin-wrap">
                <h1 style="text-align: center;">Log In</h1>
                <p style="text-align: center; font-weight:400;">login with your Maubook account!</p>
                <form action="../backend/login_backend/login.php" method="POST">
                    <div class="form-wrap">
                        <input type="text" name="username" placeholder="Username">
                        <input type="password" name="pwd" placeholder="Password">
                        <div class="signin-btn-wrapper">
                            <button class="signin-btn">Login</button>
                        </div>
                        <p class="dont_have_an_account_link"><a href="../signin_f/signin_page.php">Don't have an account?</a></p>
                    </div>
                </form>

                <div class="php-img-wrap">
                    <div class="dropdown">
                        <div class="img-wrap">
                            <img src="../pics/php-logo-24.png" class="php-img" alt="php logo">
                        </div>
                        <div class="dropdown-menu">
                            <h2 style="margin:0;"> Test Dropdown Content</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="mssg-wrap">
            <?php
                check_errors();
            ?>
        </div>
    </div>
</body>
</html>