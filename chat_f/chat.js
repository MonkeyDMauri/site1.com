
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

// this variable will then contain the name of the profile picture so we can
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

function getSelectedContantInfo(contactId) {

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

    
}


// GET CONTACTS CODE.

let allContacts = [];

// the first thing I wanna show when the page is first loaded is the contacts so the first thing to 
// do is get all te contacts and then display them.
get_contacts();
displayContacts(allContacts);

const contacts_btn = _("#radio-contacts");
contacts_btn.addEventListener("click", get_contacts);

async function get_contacts() {
    const innerLeftPanel = _(".inner-left-pannel");
    innerLeftPanel.innerHTML = `
        <div class="contacts-wrapper" style="text-align: center;"></div>
    `;

    // Get current username.
    const username = _(".username-wrap").textContent;

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