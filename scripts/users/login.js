import { gmailRegex } from "../service.js";


const login = () => {
    // Element references
    const nameLogin = document.getElementById("nameLogin");
    const errorLogin = document.getElementById("errorLogin");
    const btnLogin = document.getElementById("btnLogin");

    // API endpoint
    const loginEndpoint = "https://localhost:7284/api/Account/SignIn";

    // Login button click event
    btnLogin.addEventListener("click", handleLogin);
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
    async function handleSuccess(result) {
        localStorage.setItem("role", result); // Store the role in localStorage
        localStorage.setItem("isLogin", true);
        window.location.href = "productlist.html";






    }
    // Display error messages
    function showError(message) {
        errorLogin.innerText = message;

        // Clear password for security
        document.getElementById("password").value = "";
    }

}
login();



