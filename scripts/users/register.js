import { gmailRegex, passwordRegex } from "../service.js";

const register = () => {
    // Element references
    const nameLogin = document.getElementById("nameLogin");
    const errorLogin = document.getElementById("errorLogin");
    const btnLogin = document.getElementById("btnLogin");

    // API endpoint
    const registerEndpoint = "https://localhost:7284/api/Account/SignUp";

    // Register button click event
    btnLogin.addEventListener("click", handleRegister);

    // Handle register process
    function handleRegister() {
        const email = nameLogin.value.trim();
        const password = document.getElementById("password").value.trim();

        // Input validation
        if (!email || !password) {
            showError("Please fill in all the fields.");
            return;
        }

        if (!gmailRegex(email)) {
            showError("Please enter a valid email address.");
            return;
        }

        if (!passwordRegex(password)) {
            showError("Password must be at least 6 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
            return;
        }

        // Prepare data and send API request
        const data = { Email: email, Password: password };
        sendRegisterRequest(data);
    }

    // Send register request
    async function sendRegisterRequest(data) {
        try {
            const response = await fetch(registerEndpoint, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "include", // Include cookies if any
                body: JSON.stringify(data),
            });

            console.log(response);


            if (!response.ok) {
                const errorData = await response.json();
                showError(errorData || "Registration failed. Please try again.");
                return;
            }

            const result = await response.json();

            handleSuccess(result);
        } catch (error) {
            showError(error.message || "An error occurred during registration.");
        }
    }

    // Handle successful registration
    function handleSuccess(result) {
        localStorage.setItem("role", result);
        localStorage.setItem("isLogin", true);

        window.location.href = "index.html";
    }

    // Display error messages
    function showError(message) {
        errorLogin.innerText = message;

        errorLogin.value = "";
    }
};

register();
