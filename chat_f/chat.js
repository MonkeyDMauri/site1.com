
//show username and email.
function _(element) {
    return document.querySelector(element);
}

function show_user_info() {
    const usernameWrap = _(".username-wrap");
    const emailWrap = _(".email-wrap");

    // get current user info to then display it.
    fetch("../../backend/chat_backend/get_current_user_info.php")
    .then(res => {
        if(!res.ok) {
            throw new Error("Network response was not ok!");
        } else{ 
            return res.json();
        }
    })
    .then(data => {
        if (data.success) {
            usernameWrap.innerHTML = data.username;
            emailWrap.innerHTML = data.email;
        } else{ 
            console.log("error when getting user info");
        }
    })
    .catch(err => {
        console.error("Error when getting user info: ", err.message);
    })
}

show_user_info();

//LOGOUT CODE.

// if user clicks the logout button then
// the logout popup will appear.
document.querySelector(".logout-btn").addEventListener("click", showLogoutPopup);

// if user clicks outsite the element with the buttons or the "No" button then
// the logout popup will disappear.
document.addEventListener("click", e => {
    if (e.target.matches(".logout-popup-wrapper") || e.target.matches(".btn-no")) {
        showLogoutPopup();
    }
});

//if user clicks the "yes" button, they will be logged out.

document.querySelector(".btn-yes").addEventListener("click", logout);

function showLogoutPopup() {
    const logoutPopup = _(".logout-popup-wrapper");
    logoutPopup.classList.toggle("active");
}

function logout() {
    // sending fetch request to PHP file that will destroy session.
    fetch("../../backend/general/logout.php")
    .then(res => {
        if(!res.ok) {
            throw new Error("Network response was not successful");
        } else{ 
            return res.json();
        }
    })
    .then(data => {
        // if logout is successful we send user back to the login page.
        if (data.success) {
            window.location.href ="../../login_f/login_page.php";
        }
    })
    .catch(err => {
        console.error("Error when login out ", err.message);
    })
}


// GET CURRENT USER INFO CODE.

// this variable will then contain all info of the profile picture so we can
//dynamically change the profile pic in settings.
let userInfo;

async function getUserInfo() {

    try {
        const res = await fetch("../../backend/chat_backend/get_current_user_info.php");

        if (!res.ok) {
            throw new Error("Error in network:", res.status);
        }

        const data = await res.json();

        if (data.success) {
            userInfo = data.result;
            console.log(userInfo);
        } else {
            console.log(data.error);
        }
    } catch(error) {
        console.log("error in network getUserInfo: ", error.message);
    }
}

// everytime the page is loaded, the user details will be fetched from DB.
getUserInfo();

// CHAT CODE

// this will store contact details for when the user clicks on a contact.
let current_chat_user;

document.addEventListener("click", e => {
    if (e.target.matches("#radio-chat")) {
        showChats();
    }
})

function showChats() {
    const innerLeftPanel = _(".inner-left-pannel");

    if (!current_chat_user) {
        innerLeftPanel.innerHTML = `
            <div>No chats to display</div>
        `;
    } else {
        // checking if contact has the name of an image in DB.
        if (!current_chat_user["img"]) {

            // using con.img and con["img"] gives the same result.
            innerLeftPanel.innerHTML = `
                Now chatting with:
                <div class="contact-pic-wrap">
                    <img class="contact-pic-current" src=${current_chat_user["gender"] === "male" ? "./chat_pics/ui/images/male.jpeg" : "./chat_pics/ui/images/female.jpeg"} alt="user pic"
                    userid="${current_chat_user.id}">
                    
                    <div class='contact-name'>${current_chat_user['username']}</div>
                </div>
            `;
        } else {
            innerLeftPanel.innerHTML = `
                Now chatting with:
                <div class="contact-pic-wrap">
                    <img class="contact-pic-current" src="../../backend/chat_backend/uploads/${current_chat_user.img}" alt="user pic"
                    userid="${current_chat_user.id}">
                    
                    <div class='contact-name'>${current_chat_user['username']}</div>
                </div>
                `;
        }
    }

    // calling function to show messages section.
    showMessages();
    

}

document.addEventListener("click", e => {
    if (e.target.matches(".contact-pic")) {
        startChat(e);
    }
});

function startChat(e) {
    // getting selected contact id.
    const picElement = e.target.closest(".contact-pic");
    const userId = picElement.getAttribute("userid");
    console.log("Contact id:", current_chat_user);

    // making chat section visible.
    const radioChat = _("#radio-chat");
    radioChat.checked = true;

    //send contact id to php file to then get all the data from a user whose ID matches the one selected.
    getSelectedContantInfo(userId);
}

async function getSelectedContantInfo(contactId) {

    // data object to then be sent as JSON.
    const id = {
        "id" : contactId
    };

    fetch("../../backend/chat_backend/getSelectedContact.php", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(id)
    })
    .then(res => {
        if(!res.ok) {
            throw new Error("Error in promise when sending contact ID to php file");
        } else{
            return res.json();
        }
    })
    .then(data => {
        if (data.success) {
            console.log("Contact Info:", data.result);
            current_chat_user = data.result;

            // calling function to show chats.
            console.log("start chat");
            console.log("Current chat user", current_chat_user);
            showChats();

            // get_messages();
            displayMessages();
        } else {
            console.log(data.error);
        }
    })
}

function showMessages() {
    // displaying contact image and name at the top of the messages section.
    const messagesHeader = _(".message-section-header");

    // check if contact has an image name in db.
    if (current_chat_user.img) {
        messagesHeader.innerHTML = `
            <img class="contact-pic-messages" src="../../backend/chat_backend/uploads/${current_chat_user.img}">
            <div style="color:'black';font-size:1.5rem;">${current_chat_user.username}</div>
        `;
    } else {
        // if contact doesnt have a profile pic name, a default image will be displayed.
        messagesHeader.innerHTML = `
            <img class="contact-pic-messages" src="${current_chat_user.gender === "male" ? "./chat_pics/ui/images/male.jpeg" : "./chat_pics/ui/images/female.jpeg"}">
            <div style="color:'black';font-size:1.5rem;">${current_chat_user.username}</div>
        `;
    }

    // SHOW MESSAGES.

    const messagesWrapper = _(".messages-wrapper");

    // check if contact has an image name in db.
    if (current_chat_user.img) {
        messagesWrapper.innerHTML = message_left_with_pic() + message_right();
    } else {
        // if contact doesnt have a profile pic name, a default image will be displayed.
        messagesWrapper.innerHTML = message_left_with_no_pic() + message_right() + message_right();
    }

    // SHOW TEXT BOX AND SEND MESSAGE BUTTON.
    const btnWrapper = _(".messages-btns-wrapper");

    // if theres a contact selected the buttons will showup, otherwise it'd make no sense.
    if (current_chat_user) {
        btnWrapper.style.background= "#1e8f60"
        btnWrapper.innerHTML = `
            <div class="messages-btns-wrap">
                <label for="attach-file"><img class="clip-img" src="./chat_pics/ui/icons/clip.png"></label>
                <input type="file" name="file" style="display:none;" id="attach-file">
                <input type="text" class="message-box" placeholder="Type your message...">
                <button class="send-mssg-btn">send</button>
            </div>
        `;
    }
    
    
}

// templates for messages display.
function message_right() {
    return `
        <div class="message-right">
            <div></div>
            <img src="../../backend/chat_backend/uploads/${userInfo.img}">
            <b>${userInfo.username}</b>
            <br>
            This is a test message
            <br>
            <span style="color: #999; font-size:11px;">08 Jan 2025 03:00AM</span>
        </div>
    `;
}


function message_left_with_pic() {
    return `
        <div class="message-left">
            <div></div>
            <img src="../../backend/chat_backend/uploads/${current_chat_user.img}">
            <b>${current_chat_user.username}</b>
            <br>
            This is a test message
            <br>
            <span style="color: #999; font-size:11px;">08 Jan 2025 03:00AM</span>
        </div>
    `;
}

function message_left_with_no_pic() {
    return `
        <div class="message-left">
            <div></div>
            <img src="${current_chat_user.gender === "male" ? "./chat_pics/ui/images/male.jpeg" : "./chat_pics/ui/images/female.jpeg"}">
            <b>${current_chat_user.username}</b>
            <br>
            This is a test message
            <br>
            <span style="color: #999; font-size:11px;">08 Jan 2025 03:00AM</span>
        </div>
    `;
}

// CODE TO SEND MESSAGE.

document.addEventListener("click", e => {
    if (e.target.matches(".send-mssg-btn")){
        send_message();
    }
})

async function send_message(){
    // getting message data.
    const message_text = _(".message-box").value;

    // verify if message is empty, if it is, message will not be sent..
    if (message_text.trim() == "") {
        alert("please type something");
        return;
    }


    // message info to be sent.
    let messageInfo = {
        "senderUsername": userInfo.username,
        "mssgid": generateRandomString(30),
        "message" : message_text.trim(),
        "date": getFormattedDate(),
        "receiver" : current_chat_user.id
    };

    // checking for already existing message id.
    const flag = await get_message_id(userInfo.id, current_chat_user.id);
    if (flag) {
        messageInfo.mssgid = flag;
    }

    // sending message to be saved to messages table.
    try {
        const res = await fetch("../../backend/chat_backend/messages/save_message.php", {
            method:"POST",
            body: JSON.stringify(messageInfo)
        });
        if (!res.ok) {
            throw new Error("Error in promise when sending message", res.status);
        }

        const data = await res.json();

        if (data.success) {
            console.log("Message: ",data.result, "!!");
            console.log("Message saved");
        } else {
            console.log(data.error);
        }
    } catch(err) {
        console.error(err);
    }
    
}

async function get_message_id(senderId, receiverId) {

    const infoObject = {
        "contact_id" : receiverId,
        "userId": senderId
    };


    try {
        const res = await fetch("../../backend/chat_backend/messages/get_messages.php", {
            method: "POST",
            headers : {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(infoObject)
        });

        if (!res.ok) {
            throw new Error("Error in res promise:", res.status);
        }

        const data = await res.json();

        if (data.success) {
            console.log("messages found when trying to get mssgid");
            console.log("message id:", data.messages.mssgid);
            return data.messages.mssgid;
        } else if (data.empty) {
            console.log("No messages were found when trying to get mssgid");
            console.log("No message id was found");
            return false;
        } else {
            console.log(data.error);
        }
    } catch(err) {
        console.error(err);
    }
}


// this function will get messages depending on the id of the current chat selected, therefor it will be called when a contact is selected.
async function get_messages() {
    console.log("selected contact id from get_messages:", current_chat_user.id);

    // getting current chat selected id(receiver) to then send it as JSON.
    const dataa = {
        "contact_id" : current_chat_user.id,
        "userId" : userInfo.id
    };

    try {
        const res = await fetch("../../backend/chat_backend/messages/get_messages.php", {
            method: "POST",
            headers : {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(dataa)
        });

        if (!res.ok) {
            throw new Error("Error in res promise:", res.status);
        }

        const data = await res.json();

        if (data.success) {
            console.log("messages found");
            console.log(data.sender);
            console.log(data.receiver);
            return data.messages;
        } else if (data.empty) {
            console.log("No messages were found");
            console.log(data.sender);
            console.log(data.receiver);
            return "No messages were found";
        } else {
            console.log(data.error);
        }
    } catch(err) {
        console.error(err);
    }
}

async function displayMessages() {
    let allMessages = await get_messages();

    console.log(allMessages);
}

// function to generate random string.
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}


// function to current format date.
function getFormattedDate() {
    const now = new Date();

    // Get components of the date
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Combine into the desired format
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}



// GET CONTACTS CODE.

let allContacts = [];

// the first thing I wanna show when the page is first loaded is the contacts so the first thing to 
// do is get all te contacts and then display them.
get_contacts();
// displayContacts(allContacts);

const contacts_btn = _("#radio-contacts");
contacts_btn.addEventListener("click", get_contacts);

async function get_contacts() {
    const innerLeftPanel = _(".inner-left-pannel");
    innerLeftPanel.innerHTML = `
        <div class="contacts-wrapper" style="text-align: center;"></div>
    `;

    // Get current username.
    const username = _(".username-wrap").textContent;
    console.log("current user username:", username);

    const jsonData = { "username": username };

    try {
        // load gif on.
        const loader = _(".loader");
        loader.classList.toggle("active");

        // Send fetch request.
        const res = await fetch("../../backend/chat_backend/get_contacts.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonData),
        });

        if (!res.ok) {
            throw new Error("Network connection was not successful");
        }

        const data = await res.json();

        if (data.success) {
            console.log("Contacts fetched: ", data.result);
            // allContacts = Array.isArray(data.result) ? data.result : [];
            allContacts = data.result;

            // load gif off.
            loader.classList.toggle("active");
            displayContacts(allContacts);
        } else {
            // If no data is received, display a message in the contacts panel.
            console.log(data.error);
            const contactsWrapper = _(".contacts-wrapper");
            contactsWrapper.innerHTML = `No contacts to show`;
        }
    } catch (err) {
        console.error("Error: ", err.message);
    }
}


function displayContacts(contacts) {
    
    const contactsWrapper = _(".contacts-wrapper");
    contactsWrapper.innerHTML = ` `;

    contacts.forEach(con => {
        const contact = document.createElement("div");
        contact.classList.add("contact");

        if (!con["img"]) {

            // using con.img and con["img"] gives the same result.
            contact.innerHTML = `
                <img class="contact-pic" src=${con["gender"] === "male" ? "./chat_pics/ui/images/male.jpeg" : "./chat_pics/ui/images/female.jpeg"} alt="user pic"
                userid="${con.id}">
                <br>
                <div class='contact-name'>${con['username']}</div>
            `;
        } else {
            contact.innerHTML = `
        
                <img class="contact-pic" src="../../backend/chat_backend/uploads/${con.img}" alt="user pic"
                userid="${con.id}">
                <br>
                <div class='contact-name'>${con['username']}</div>
                `;
        }

        contactsWrapper.appendChild(contact);
    });


    
}

// SETTINGS CODE

document.addEventListener("click", e => {
    if (e.target.matches("#radio-settings")) {
        showSettings();
    }
})

async function showSettings() {

    // check user info before displaying.
    await getUserInfo();
    

    // checking ig current user has a profile pic
    const profilePic = userInfo["img"];

    console.log("show settings");
    console.log(profilePic);

    const innerLeftPanel = _(".inner-left-pannel");
    innerLeftPanel.innerHTML = " ";
    innerLeftPanel.innerHTML = `
    <div class="settings-wrapper">

        <div style="display:flex; flex-direction: column; align-items:center;">
            <img class="settings-profile-pic" src="../../backend/chat_backend/uploads/${profilePic ? userInfo["img"] : "male.jpg"}">
            <label for="change-img-input" class="change-btn" style="display:inline-block; text-align:center;">
                Change Image
            </label>
            <input type="file" id="change-img-input" style="display:none;" onchange="upload_image(this.files)">
        </div>
        <div class="signin-wrap">
            <h1 style="text-align: center;">Settings</h1>
            <form action="../../backend/chat_backend/settings.php" method="POST">
                <div class="form-wrap">
                    <input type="text" name="username" placeholder="Username">
                    <input type="text" name="email" placeholder="E-mail ">
                        
                    <div>
                        <h2 style="margin:0;">Gender</h2>
                        <div style="display:flex; justify-content:center; width: 50px">
                            <div>
                                <Label for="radio-male">Male</Label>
                                <input type="radio" name="gender" value="male" id="radio-male" checked>
                            </div>
                            <div>
                                <Label for="radio-female">Female</Label>
                                <input type="radio" name="gender" value="female" id="radio-female">
                            </div>
                        </div>
                    </div>

                    <input type="password" name="pwd" placeholder="Password">
                    <input type="password" name="pwd2" placeholder="Retype password">
                    <div class="signin-btn-wrapper">
                        <button type="submit" class="signin-btn">Save</button>
                    </div>
                </div>
            </form>
         </div>
    </div>
    `;
}

// change profile pic code.

async function upload_image(files) {

    if (!files.length) {
        console.error("No file selected");
        return;
    }

    // sending image info over to uploader php file.

    try {

        // getting image name
        const myFile = files[0].name;

        // create a form data object to send the file.
        const fileForm = new FormData();
        fileForm.append("file", files[0]);

        // changing look for the button while image is being uploaded, disabling also keeps the user
        // from clicking on it while uploading image
        const changeImgBtn = _(".change-btn");
        changeImgBtn.disabled =true;
        changeImgBtn.innerHTML = "Uploading Img...";

        const res = await fetch("../../backend/chat_backend/uploader.php", {
            method: "POST",
            body: fileForm
        })
        
        if (!res.ok) {
            throw new Error("Connection with uploader.php was not successful");
        }

        const data = await res.json();

        if (data.success) {
            console.log("success");
            changeImgBtn.disabled = false;
            changeImgBtn.innerHTML = "Change Image";
            console.log(data.result);
            saveImage(data.picName);
        } else {
            console.log(data.error);
        }

    } catch(error) {
        console.log(error);
    }


}

// CODE TO SAVE IMAGE NAME INTO DB.
// once the pic is uploaded successfully this function will be called.

async function saveImage(picName) {

    try {

        // data object.
        const dataObj = {
            "fileName" : picName
        }

        const res = await fetch("../../backend/chat_backend/saveImageToDb.php", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(dataObj)
        })

        if (!res.ok) {
            throw new Error("Network connecton unsuccessful:", res.status);
        }

        const data = await res.json();

        if (data.success) {
            console.log("pic was saved");
            picName = data.name;
            console.log(picName);
            await showSettings();
            await updatePicProfile();
        } else {
            console.log(data.error);
        }
    } catch(error) {
        console.error(error);
    }
}

// UPDATING PROFILE PICTURE IN LEFT PANEL.

updatePicProfile();

async function updatePicProfile() {


    await getUserInfo();

    const picWrapper = _(".profile-pic-wrapper");

    picWrapper.innerHTML = `
        <img class="profile-img" src="../../backend/chat_backend/uploads/${userInfo["img"] ? userInfo["img"] : "male.jpg"}" alt="profile pic">
    `;
}

// CODE TO START A CHAT.





// CREATE TABLE messages (
//     id BIGINT PRIMARY KEY AUTO_INCREMENT,
//     sender BIGINT,
//     receiver BIGINT,
//     message TEXT,
//     files TEXT,
//     date DATETIME,
//     seen INT,
//     received INT,
//     deleted_sender TINYINT,
//     deleted_receiver TINYINT,
// );