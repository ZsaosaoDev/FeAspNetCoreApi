const btnLogOut = document.getElementById('btnLogOut');

btnLogOut.addEventListener('click', async (e) => { // Make the click event handler async
    e.preventDefault();
    await logout(); // Await the logout function
});

const logout = async () => { // Make logout async
    try {
        const response = await fetch("https://localhost:7284/api/Account/Logout", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies if any
        });

        if (!response.ok) {
            const errorData = await response.json(); // Get the JSON data from the response
            console.log(errorData);
            return;
        } else {
            localStorage.setItem('isLogin', false);
            localStorage.setItem('role', '');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error("Error during logout:", error);
    }
};