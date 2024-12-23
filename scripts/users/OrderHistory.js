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
            console.log(data);
            displayOrders(data);

        }

    } catch (error) {
        console.error("Error fetching orders:", error);

    }
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


function displayOrders(orders) {
    const container = document.getElementById("order-list");
    container.innerHTML = ""; // Clear container

    if (!orders.length) {
        container.innerHTML = `<div class="no-data">No orders found.</div>`;
        return;
    }

    orders.forEach(order => {
        const orderElement = document.createElement("div");
        orderElement.classList.add("order-item");
        orderElement.innerHTML = `
        <div class="order-id">Order ID: ${order.orderId}</div>
        <div class="order-date">Date: ${order.orderDate}</div>
        <div class="order-total">Total: ${order.totalPrice.toFixed(3)} ₫</div>
        <button class="view-details-btn" data-order-id="${order.orderId}">View Details</button>
    `;
        container.appendChild(orderElement);
    });

    attachOrderDetailsListeners();
}

function displayOrderDetails(products) {
    const container = document.getElementById("order-details");
    container.innerHTML = ""; // Clear container

    if (!products.length) {
        container.innerHTML = `<div class="no-data">No products found for this order.</div>`;
        return;
    }

    products.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("product-item");
        productElement.innerHTML = `
        <div class="product-name">${product.name}</div>
        <div class="product-price">${(product.price * (1 - product.discount / 100)).toFixed(3)} ₫</div>
        <div class="product-quantity">Quantity: ${product.colorDtos[0]?.sizeDtos[0]?.quantityOrder || 0}</div>
    `;
        container.appendChild(productElement);
    });
}


function attachOrderDetailsListeners() {
    document.querySelectorAll(".view-details-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const orderId = e.target.dataset.orderId;
            fetchOrderDetails(orderId);
        });
    });
}
fetchOrders();