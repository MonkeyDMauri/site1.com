<?php
require_once "../backend/general/session.conf.php";

if (!isset($_SESSION["logged_in"]) && $_SESSION["logged_in"] !== true) {
    header("location: ../../login_f/login_page.php");
    die();
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Chat</title>
    <link rel="stylesheet" href="./chat_style.css">
    <script src="./chat.js" defer></script>
</head>
<body>
    <div class="wrapper">
        <div class="left-pannel">
            <div style="padding:1rem;">
                <div class="profile-pic-wrapper">
                    <img class="profile-img" src="./chat_pics/ui/images/luffy-profile.png" alt="user 3">
                </div>
                <br><br>
                <div class="username-wrap" style="font-size:1.3rem;"><?php echo $_SESSION["user_username"]?></div>
                <br>
                <div class="email-wrap" style="opacity:0.5; margin:0; font-size:1rem">Email</div>
                <br><br><br>
                <div>
                    <label class="label-chat" for="radio-chat">Chat
                        <img src="./chat_pics/ui/icons/chat.png" alt="settings-chat">
                    </label>
                    <label class="label-contacts" for="radio-contacts">Contacts
                        <img src="./chat_pics/ui/icons/contacts.png" alt="settings-contacts">
                    </label>
                    <label class="label-settings" for="radio-settings">Settings
                        <img src="./chat_pics/ui/icons/settings.png" alt="settings img">
                    </label>
                    <label class="logout-btn">Logout</label>                    
                </div>
            </div>
        </div>
        <div class="right-pannel">
            <div class="header">
                <div class="loader">
                    <img src="./chat_pics/ui/icons/giphy.gif" alt="loading gif" style="width: 110px;">
                </div>    
                Maubook
            </div>
            <div class="containe" style="display:flex;">

                

                <div class="inner-left-pannel">

                </div>

                <input type="radio" id="radio-chat" name="box" style="display:none;">
                <input type="radio" id="radio-contacts" name="box" style="display:none;" checked>
                <input type="radio" id="radio-settings" name="box" style="display:none;">

                <div class="inner-right-pannel">
                    <div class="message-section-header">
                    </div>
                    <div class="messages-wrapper">
                        <!-- messages go here -->
                         <h3>Nothing to show here</h3>
                    </div> 
                    <div class="messages-btns-wrapper">
                        <!-- box to type message and send messages go here -->
                         
                         
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="logout-popup-wrapper">
        <div class="logout-wrap">
            <h2>Dou you want to logout?</h2>
            <div class="btn-wrapper">
                <button class="btn btn-no">No</button>
                <button class="btn btn-yes">Yes</button>
            </div>
        </div>
    </div>
</body>
</html>