
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
            console.log(data);
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

// CHAT CODE

document.addEventListener("click", e => {
    if (e.target.matches("#radio-chat")) {
        showChats();
    }
})

function showChats() {
    const innerLeftPanel = _(".inner-left-pannel");
    innerLeftPanel.innerHTML = `
        <div>Chat</div>
    `;

}


// GET CONTACTS CODE.

let allContacts = [];

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
        console.log("display");
        const contact = document.createElement("div");
        contact.classList.add("contact");

        contact.innerHTML = `
        
            <img src=${con["gender"] === "male" ? "./chat_pics/ui/images/male.jpeg" : "./chat_pics/ui/images/female.jpeg"} alt="user pic">
            <br>
            <div class='contact-name'>${con['username']}</div>
        `;

        contactsWrapper.appendChild(contact);
    });


    
}

// SETTINGS CODE

document.addEventListener("click", e => {
    if (e.target.matches("#radio-settings")) {
        showSettings();
    }
})

function showSettings() {
    const innerLeftPanel = _(".inner-left-pannel");
    innerLeftPanel.innerHTML = `
    <div class="settings-wrapper">

        <div style="display:flex; flex-direction: column; align-items:center;">
            <img class="settings-profile-pic" src="./chat_pics/ui/images/male.jpeg">
            <button class="change-btn">Change Image</button>
        </div>
        <div class="signin-wrap">
            <h1 style="text-align: center;">Sign In</h1>
            <form action="" method="POST">
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