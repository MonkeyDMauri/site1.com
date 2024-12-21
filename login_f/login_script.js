

// practice dropdown menu.

document.addEventListener("click", e => {
    const isDropdown = e.target.matches(".php-img");

    if (!isDropdown && e.target.closest(".dropdown") != null) {
        console.log("clicking content");
        return;
    }

    // to keep track of current dropdown, this is in case there are many of them,
    // but in this case its only onemptied, I do it for best practices anyways
    let thisDropdown;

    if (isDropdown) {
        thisDropdown = e.target.closest(".dropdown");
        thisDropdown.classList.toggle("active");
    }

    document.querySelectorAll(".dropdown").forEach(dropdown => {
        if (dropdown === thisDropdown) {
            return;
        } else {
            dropdown.classList.remove("active");
        }
    })
})