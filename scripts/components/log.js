
const icon = document.getElementById("icon");
const btnLogin = document.getElementById("btnLogin");
const inputPass = document.getElementById("inputPass");
// Input focus/blur styling
nameLogin.addEventListener("focus", () => highlightInput(true));
nameLogin.addEventListener("blur", () => highlightInput(false));

// Toggle password input and login button when icon is clicked
icon?.addEventListener("click", () => {
    if (nameLogin.value.trim() !== "") {
        inputPass.style.display = "block";
        btnLogin.style.display = "block";
    }
});



// Highlight input on focus/blur
function highlightInput(isFocused) {
    const inputName = document.getElementById("inputName");
    if (isFocused) {
        inputName.style.border = "1px solid #007bff";
        icon.style.top = "50%";
    } else {
        inputName.style.border = "1px solid #ced4da";
        icon.style.top = "calc(50% - 10px)";
    }
}