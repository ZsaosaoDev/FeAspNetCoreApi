import { popUpError, refreshToken } from "../service.js";

async function fetchProductData() {
    try {
        const response = await fetch("https://localhost:7284/api/GetProductsWithSelectedColors", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (response.status === 401) {
            const success = await refreshToken();
            if (success) return fetchProductData();
            return popUpError("Please log in to view your buy later list.");
        }

        if (!response.ok) throw new Error("Failed to fetch products.");

        const { products } = await response.json();
        displayProductData(products);
        attachEventListeners();

    } catch (error) {
        console.error("Error fetching product data:", error);
        popUpError("An error occurred while fetching products.");
    }
}

async function updateQuantity(sizeId, quantity) {
    try {
        const response = await fetch("https://localhost:7284/api/UpdateQuantityInBuyLater", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ SizeId: sizeId, Quantity: quantity }),
        });

        if (response.status === 401) {
            const success = await refreshToken();
            if (success) return updateQuantity(sizeId, quantity);
            return popUpError("Please log in to update the quantity.");
        }

        if (!response.ok) {
            const data = await response.json();
            return popUpError(data.message || "Failed to update quantity.");
        }

        fetchProductData();

    } catch (error) {
        console.error("Error updating quantity:", error);
        popUpError("An error occurred while updating the quantity.");
    }
}

function displayProductData(products) {
    const container = document.getElementById("product-container");
    container.innerHTML = ""; // Clear container

    if (!products.length) {
        container.innerHTML = `<div class="no-data">No products with selected colors found.</div>`;
        return;
    }

    const fragment = document.createDocumentFragment();

    products.forEach((product) => {
        const selectedColors = product.colorDtos.filter(color => color.isPreviouslySelected);

        selectedColors.forEach((color) => {
            color.sizeDtos.forEach((size) => {
                const sizeContainer = document.createElement("div");
                sizeContainer.classList.add("size-container");
                sizeContainer.dataset.sizeId = size.sizeDtoId;

                sizeContainer.innerHTML = `
                    <div class="size-block">
                        <div class="image-container">
                            ${color.imageDtos?.length
                        ? `<img src="data:image/jpeg;base64,${color.imageDtos[0].data}" alt="${color.name} Image" />`
                        : `<img src="../../assets/images/defaults/NoImageAvailable.jpg" />`}
                        </div>
                        <div class="productInfor">
                            <div class="name">${product.name}</div>
                            <div class="sizeAndColor">${size.name} / ${color.name}</div>
                            <div class="price-container">
                                <p class="price">${(product.price * (1 - product.discount / 100)).toFixed(3)} ₫</p>
                                <p class="discount">${product.discount}%</p>
                                <p class="original-price">${product.price}.000 ₫</p>
                            </div>
                            <div class="sizeAndTrash">
                                <div class="size-controls">
                                    <button class="decrement-btn" data-size-id="${size.sizeDtoId}" data-quantity="${size.quantityOrder - 1}">-</button>
                                    <input type="number" value="${size.quantityOrder}" readonly />
                                    <button class="increment-btn" data-size-id="${size.sizeDtoId}" data-quantity="${size.quantityOrder + 1}">+</button>
                                </div>
                                <div data-size-id="${size.sizeDtoId}" class="trash">
                                    <i class="fa-solid fa-trash-can"></i>
                                </div>
                            </div>
                        </div>
                    </div>`;

                fragment.appendChild(sizeContainer);
            });
        });
    });

    container.appendChild(fragment);
}

function attachEventListeners() {
    attachQuantityControlListeners();
    attachDeleteListeners();
    selectOrder();
    loadPayment();
    loadDelivery();
    order();
}

function attachQuantityControlListeners() {
    document.querySelectorAll(".decrement-btn, .increment-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();
            const sizeId = e.target.dataset.sizeId;
            const quantity = parseInt(e.target.dataset.quantity, 10);
            if (quantity >= 0) updateQuantity(sizeId, quantity);
        });
    });
}

function attachDeleteListeners() {
    document.querySelectorAll(".trash").forEach(trash => {
        trash.addEventListener("click", async (e) => {
            const sizeId = trash.dataset.sizeId;
            try {
                const response = await fetch("https://localhost:7284/api/RemoveFromBuyLater", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(parseInt(sizeId, 10)),
                });

                if (response.status === 401) {
                    const success = await refreshToken();
                    if (success) return attachDeleteListeners();
                    return popUpError("Please log in to remove the product.");
                }

                if (!response.ok) {
                    const data = await response.json();
                    return popUpError(data.message || "Failed to remove the product.");
                }

                fetchProductData();

            } catch (error) {
                console.error("Error removing product:", error);
                popUpError("An error occurred while removing the product.");
            }
        });
    });
}

const selectedSizes = new Set();

function selectOrder() {
    document.querySelectorAll(".size-container").forEach(sizeContainer => {
        const sizeId = sizeContainer.dataset.sizeId;

        if (selectedSizes.has(sizeId)) {
            sizeContainer.classList.add("selected");
        }

        sizeContainer.addEventListener("click", (e) => {
            if (e.target.closest(".size-controls")) return;

            if (sizeContainer.classList.contains("selected")) {
                sizeContainer.classList.remove("selected");
                selectedSizes.delete(sizeId);
            } else {
                sizeContainer.classList.add("selected");
                selectedSizes.add(sizeId);
            }

            order();
        });
    });
}

function order() {
    const selectedContainers = document.querySelectorAll(".size-container.selected");
    let totalQuantity = 0;
    let totalPrice = 0;

    selectedContainers.forEach(container => {
        const priceElement = container.querySelector(".price");
        const quantityInput = container.querySelector("input[type='number']");
        const price = parseFloat(priceElement.textContent.replace(" ₫", ""));
        const quantity = parseInt(quantityInput.value, 10);

        totalQuantity += quantity;
        totalPrice += price * quantity;
    });

    const feeDeliver = parseFloat(document.getElementById("feeDeliver").textContent.replace(" ₫", "")) || 0;
    const finalTotal = totalPrice + feeDeliver;

    document.getElementById("total-quantity").textContent = totalQuantity;
    document.getElementById("total-price").textContent = totalPrice.toFixed(3) + " ₫";
    document.getElementById("total").textContent = finalTotal.toFixed(3) + " ₫";
}

async function loadPayment() {
    try {
        const response = await fetch("https://localhost:7284/api/allMethodPayment", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (response.status === 401) {
            const success = await refreshToken();
            if (success) return loadPayment();
            return popUpError("Please log in to view your payment methods.");
        }

        if (!response.ok) throw new Error("Failed to fetch payment methods.");

        const data = await response.json();
        const paymentSelect = document.querySelector(".optionPayment select");

        paymentSelect.innerHTML = data.map(payment => `<option value="${payment.paymentId}">${payment.meThodPayment}</option>`).join('');

    } catch (error) {
        console.error("Error fetching payment methods:", error);
        popUpError("An error occurred while fetching payment methods.");
    }
}

async function loadDelivery() {
    try {
        const response = await fetch("https://localhost:7284/api/allDelivery", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (response.status === 401) {
            const success = await refreshToken();
            if (success) return loadDelivery();
            return popUpError("Please log in to view delivery options.");
        }

        if (!response.ok) throw new Error("Failed to fetch delivery options.");

        const data = await response.json();
        const deliverySelect = document.querySelector(".optionDelivery");
        const feeDeliverElement = document.getElementById("feeDeliver");

        deliverySelect.innerHTML = data.map(delivery => `<option value="${delivery.deliveryId}">${delivery.deliveryType}</option>`).join('');
        feeDeliverElement.textContent = data[0].fee.toFixed(3) + " ₫";

        deliverySelect.addEventListener("change", (e) => {
            const selectedIndex = deliverySelect.selectedIndex;
            const fee = data[selectedIndex].fee;

            feeDeliverElement.textContent = fee.toFixed(3) + " ₫";

            const priceTotal = parseFloat(document.getElementById("total-price").textContent.replace(" ₫", ""));
            const totalElement = document.getElementById("total");

            totalElement.textContent = (priceTotal + fee).toFixed(3) + " ₫";
        });

    } catch (error) {
        console.error("Error fetching delivery options:", error);
        popUpError("An error occurred while fetching delivery options.");
    }
}

fetchProductData();




async function submitOrder() {
    try {
        // Get all selected sizeIds
        const selectedSizeIds = Array.from(selectedSizes);

        if (selectedSizeIds.length === 0) {
            return popUpError("Please select at least one product size to order.");
        }

        // Get selected paymentId and deliverId
        const paymentSelect = document.querySelector(".optionPayment select");
        const deliverySelect = document.querySelector(".optionDelivery");

        const paymentId = parseInt(paymentSelect.value, 10);
        const deliverId = parseInt(deliverySelect.value, 10);

        if (isNaN(paymentId) || isNaN(deliverId)) {
            return popUpError("Please select both a payment method and a delivery option.");
        }

        // Prepare the payload
        const payload = {
            sizeIds: selectedSizeIds.map(id => parseInt(id, 10)), // Ensure IDs are numbers
            paymentId: paymentId,
            deliverId: deliverId
        };


        // Send the POST request
        const response = await fetch("https://localhost:7284/api/Order", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });



        // Handle 401 Unauthorized
        if (response.status === 401) {
            const success = await refreshToken();
            if (success) return submitOrder();
            return popUpError("Please log in to complete your order.");
        }

        // Handle the response
        const data = await response.json();
        console.log(data);

        if (response.ok) {
            popUpError(data.message || "Order placed successfully!");
            fetchProductData(); // Refresh product data
        } else {
            popUpError(data.message || "Failed to place the order.");
        }

    } catch (error) {
        console.error("Error submitting order:", error);
        popUpError("An error occurred while submitting the order.");
    }
}

// Attach submitOrder function to an order button
document.getElementById("order-button").addEventListener("click", (e) => {
    e.preventDefault();
    submitOrder();
});










