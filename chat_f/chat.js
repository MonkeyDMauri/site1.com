
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
            die();
        }
    })
    .catch(err => {
        console.error("Error when login out ", err.message);
    })
}