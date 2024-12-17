import { gmailRegex } from "../service.js";

// Element references
const nameLogin = document.getElementById("nameLogin");
const icon = document.getElementById("icon");
const btnLogin = document.getElementById("btnLogin");
const inputPass = document.getElementById("inputPass");
const errorLogin = document.getElementById("errorLogin");

// API endpoint
const loginEndpoint = "https://localhost:7284/api/Account/SignIn";

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

// Login button click event
btnLogin.addEventListener("click", handleLogin);

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

// Handle login process
function handleLogin() {
    const email = nameLogin.value.trim();
    const password = document.getElementById("password").value.trim();

    // Input validation
    if (!email || !password) {
        showError("Please enter your email and password.");
        return;
    }

    if (!gmailRegex(email)) {
        showError("Please enter a valid email address.");
        return;
    }

    // Prepare data and send API request
    const data = { Email: email, Password: password };
    sendLoginRequest(data);
}

// Send login request
async function sendLoginRequest(data) {
    try {
        const response = await fetch(loginEndpoint, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies if any
            body: JSON.stringify(data),
        });



        if (!response.ok) {
            const errorData = await response.json(); // Get the JSON data from the response
            showError(errorData);
            return;
        }
        const result = await response.json();
        handleSuccess(result);
    } catch (error) {
        showError(error.message || "An error occurred during login.");

    }
}

// Handle successful login
function handleSuccess(result) {
    localStorage.setItem("role", result.role); // Store the role in localStorage
    ;
}

// Display error messages
function showError(message) {
    errorLogin.innerText = message;
    errorLogin.style.color = "red";

    // Clear password for security
    document.getElementById("password").value = "";
}





