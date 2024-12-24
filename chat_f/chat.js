
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

//logout code.

document.querySelector(".logout-btn").addEventListener("click", logout);

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