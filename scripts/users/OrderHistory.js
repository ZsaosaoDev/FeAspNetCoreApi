import { popUpError, refreshToken } from "../service.js";

async function fetchOrders() {
    try {
        const response = await fetch("https://localhost:7284/api/GetOrdersByUserId", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (response.status === 401) {
            const success = await refreshToken();
            if (success) return fetchOrders();
            return popUpError("Please log in to view your order history.");
        }

        if (response.ok) {
            const data = await response.json();
            displayOrders(data);

        }

    } catch (error) {
        console.error("Error fetching orders:", error);

    }
}

function displayOrders(orders) {
    const container = document.getElementById("order-list");
    container.innerHTML = ""; // Xóa nội dung cũ trong container

    if (!orders.length) {
        container.innerHTML = `<div class="no-data">Không có đơn hàng nào.</div>`;
        return;
    }

    orders.forEach(order => {
        const orderElement = document.createElement("div");
        orderElement.classList.add("order-item");

        // Gắn `data-order-id` vào phần tử `order-item`
        orderElement.setAttribute("data-order-id", order.orderId);

        orderElement.innerHTML = `
            <div class="order-id">
                <div class="order-number">
                    ID: ${order.orderId}
                </div>
                <div>
                    <i class="fa-brands fa-shopify shopify-icon"></i>
                </div>
            </div>
            <div class="order-date">
                <div class="date-label">
                    Ngày đặt hàng
                </div>
                <div class="date-value">
                    ${order.orderDate}
                </div>
            </div>
            <div class="order-status">
                <div class="status-label">
                    Trạng thái
                </div>
                <div class="status-value">
                    ${order.orderStatus}
                </div>
            </div>
            <div class="order-delivery">
                <div class="delivery-label">
                    Phương thức giao hàng
                </div>
                <div class="delivery-value">
                    ${order.deliverMethod}
                </div>
            </div>
            <div class="order-total">
                <div class="total-label">
                    Tổng tiền
                </div>
                <div class="total-value">
                    ${Number(order.totalPrice).toLocaleString()}.000 ₫
                </div>
            </div>
        `;

        container.appendChild(orderElement);
    });

    // Gắn sự kiện click cho toàn bộ phần tử `order-item`
    attachOrderDetailsListeners();
}

function attachOrderDetailsListeners() {
    // Chọn tất cả các phần tử `.order-item`
    document.querySelectorAll(".order-item").forEach(orderItem => {
        orderItem.addEventListener("click", (e) => {
            // Lấy `orderId` từ thuộc tính `data-order-id`
            const orderId = e.currentTarget.dataset.orderId;

            if (!orderId) {
                console.error("Order ID not found!");
                return;
            }

            // Gọi hàm fetch chi tiết đơn hàng
            fetchOrderDetails(orderId);
        });
    });
}



async function fetchOrderDetails(orderId) {
    try {
        const response = await fetch(`https://localhost:7284/api/GetProductsByOrderIdAsync?orderId=${orderId}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (response.status === 401) {
            const success = await refreshToken();
            if (success) return fetchOrderDetails(orderId);
            return popUpError("Please log in to view order details.");
        }

        if (!response.ok) throw new Error("Failed to fetch order details.");

        if (response.ok) {
            const products = await response.json();
            console.log(products);
            displayOrderDetails(products);
        }

    } catch (error) {
        console.error("Error fetching order details:", error);
        popUpError("An error occurred while fetching order details.");
    }
}




function displayOrderDetails(products) {
    const container = document.getElementById("order-details");

    container.innerHTML = ""; // Clear the container
    container.style.padding = "30px 20px 20px 20px"; // Add padding to the container

    // Thêm nút đóng
    const closeButton = document.createElement("button");
    closeButton.classList.add("close-btn");
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", () => {
        container.style.display = "none"; // Ẩn container khi nhấn nút
    });
    container.appendChild(closeButton);

    // Hiển thị thông báo nếu không có sản phẩm
    if (!products || !products.length) {
        const noDataElement = document.createElement("div");
        noDataElement.classList.add("no-data");
        noDataElement.textContent = "No products found for this order.";
        container.appendChild(noDataElement);
        return;
    }

    // Duyệt qua danh sách sản phẩm
    products.forEach((product) => {
        // Lấy thông tin cơ bản của sản phẩm
        const productName = product.name || "Unknown Product";
        const originalPrice = parseFloat(product.price) || 0;
        const discount = parseFloat(product.discount) || 0;
        const discountedPrice =
            (originalPrice * (1 - discount / 100)).toFixed(3) + " ₫";
        const quantity = product.colorDtos?.[0]?.sizeDtos?.[0]?.quantityOrder || 0;
        const size = product.colorDtos?.[0]?.sizeDtos?.[0]?.name || "N/A";
        const colorName = product.colorDtos?.[0]?.name || "N/A";

        // Lấy ảnh từ dữ liệu base64
        const imageBase64 = product.colorDtos?.[0]?.imageDtos?.[0]?.data || "";
        const imageUrl = imageBase64
            ? `data:image/jpeg;base64,${imageBase64}`
            : "placeholder.jpg"; // Placeholder nếu không có ảnh

        // Tạo phần tử HTML cho từng sản phẩm
        const productElement = document.createElement("div");
        productElement.classList.add("product-item");

        productElement.innerHTML = `
            <div class="product-details">
                <div class="product-image">
                    <img src="${imageUrl}" alt="${productName}" />
                </div>
                <div class="product-info">
                    <h3 class="product-name">${productName}</h3>
                    <p><strong>Original Price:</strong> ${originalPrice.toFixed(
            3
        )} ₫</p>
                    <p><strong>Discount:</strong> ${discount}%</p>
                    <p><strong>Discounted Price:</strong> ${discountedPrice}</p>
                    <p><strong>Quantity:</strong> ${quantity}</p>
                    <p><strong>Size:</strong> ${size}</p>
                    <p><strong>Color:</strong> ${colorName}</p>
                </div>
            </div>
        `;

        // Thêm sản phẩm vào container
        container.appendChild(productElement);
    });

    // Hiển thị container
    container.style.display = "block";
}





fetchOrders();