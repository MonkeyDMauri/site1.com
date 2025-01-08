<?php

function message_left($currentContact) {
    if ($currentContact) {
        echo '<div class="message-left">
            <div></div>
            <img src="${$currentContact.img ? "../../backend/chat_backend/uploads/${current_chat_user.img}" : "./chat_pics/ui/images/male.jpeg"}">
            <b>${currentContact.username}</b>
            <br>
            This is a test message
            <br>
            <span style="color: #999; font-size:11px;">08 Jan 2025 03:00AM</span>
        </div>';
    }
}

function message_right($currentContact) {
    echo '
    
        <div class="message-right">
            <div></div>
            <img src="../../backend/chat_backend/uploads/${userInfo.img}">
            <b>${userInfo.username}</b>
            <br>
            This is a test message
            <br>
            <span style="color: #999; font-size:11px;">08 Jan 2025 03:00AM</span>
        </div>
    ';
}