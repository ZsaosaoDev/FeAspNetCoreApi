const gmailRegex = (text) => {
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i; // Define the regex pattern as a RegExp object
    return regex.test(text); // Use .test() to check if the text matches the regex
};
const passwordRegex = (text) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/; // Điều chỉnh regex
    return regex.test(text); // Kiểm tra nếu chuỗi khớp với regex
};

const popUp = (img, name, color, size, price) => {
    const timeAnimation = 2;
    const div = document.createElement('div');
    div.id = 'popUp';

    div.innerHTML = `
        <div style="border-bottom: 1px solid black; padding: 10px 0; font-weight: 700;" class="titlePopup">
            <p style="margin: 0;">Đã thêm vào giỏ hàng</p>
        </div>
        <div style="display: flex; padding: 16px 0;" class="contentPopup">
            <img
                src="${img}" alt="Hình ảnh sản phẩm">
            <div style="display: flex; justify-content: space-between; flex-direction: column; padding: 0 10px;"
                class="infoPopup">
                <h3 style="font-size: 20px; font-weight: 700;">${name}</h3>
                <div style="font-size: 14px; line-height: 14px; font-weight: 500;">
                    <p style="margin: 0;">${color}/${size}</p>
                    <p style="margin: 0;">${price}</p>
                </div>
            </div>
        </div>
        <div style="padding-bottom: 20px;">
            <a href="/pages/users/buylater.html">
                <button id="btnPopup">
                    Xem Giỏ hàng
                </button>
            </a>
        </div>`;

    div.style.animation = `popUpDown ${timeAnimation}s`;
    document.body.appendChild(div); // Thêm popup vào body

    const timeDelay = timeAnimation * 1000 + 1000;

    setTimeout(() => {
        div.style.animation = `popUpUp ${timeAnimation}s forwards`;
    }, timeDelay);

    setTimeout(() => {
        div.style.display = 'none';
    }, timeDelay + timeAnimation * 1000);
};


const popUpError = (message) => {
    const timeAnimation = 2;
    const div = document.createElement('div');
    div.id = 'popUp';

    div.innerHTML = `
        <div style="border-bottom: 1px solid black; padding: 10px 0; font-weight: 700;" class="titlePopup">
            <p style="margin: 0;">Thông báo</p>
        </div>
        <div style="display: flex; padding: 16px 0;" class="contentPopup">
            <div style="display: flex; justify-content: space-between; flex-direction: column; padding: 0 10px;"
                class="infoPopup">
                <h3 style="font-size: 14px; font-weight: 700;">${message}</h3>
            </div>
        </div>`;

    div.style.animation = `popUpDown ${timeAnimation}s`;
    document.body.appendChild(div); // Thêm popup vào body

    const timeDelay = timeAnimation * 1000 + 1000;

    setTimeout(() => {
        div.style.animation = `popUpUp ${timeAnimation}s forwards`;
    }, timeDelay);

    setTimeout(() => {
        div.style.display = 'none';
    }, timeDelay + timeAnimation * 1000);
};

const checkLogin = () => {
    const isLogin = localStorage.getItem('isLogin');
    return isLogin === 'true';
}

async function refreshToken() {
    try {
        const response = await fetch(`https://localhost:7284/api/Account/RefreshToken`, {
            method: "POST",
            credentials: "include", // Send cookies with this request
        });

        if (response.ok) {
            console.log("Token refreshed successfully.");
            return true;
        } else {
            console.error("Failed to refresh token. Response:", await response.text());
            return false;
        }
    } catch (error) {
        console.error("Error refreshing token:", error);
        return false;
    }
}

export { gmailRegex, passwordRegex, popUp, checkLogin, popUpError, refreshToken }; // Export the function to be used in other modules