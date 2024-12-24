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
                <img class="profile-img" src="./chat_pics/ui/images/user3.jpg" alt="user 3">
                <br><br>
                <div class="username-wrap" style="font-size:1.3rem;"></div>
                <br>
                <div class="email-wrap" style="opacity:0.5; margin:0; font-size:1rem"></div>
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
                </div>
            </div>
        </div>
        <div class="right-pannel">
            <div class="header">My Chat</div>
            <div class="containe">

                <div class="inner-left-pannel"></div>

                <input type="radio" id="radio-chat" name="box" style="display:none;">
                <input type="radio" id="radio-contacts" name="box" style="display:none;">
                <input type="radio" id="radio-settings" name="box" style="display:none;">

                <div class="inner-right-pannel"></div>
            </div>
        </div>
    </div>
</body>
</html>