import { popUpError, refreshToken } from "../service.js";

async function fetchProductData() {
    try {

        const response = await fetch("https://localhost:7284/api/GetProductsWithSelectedColors", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies if needed
        });

        if (response.status === 401) {
            const success = await refreshToken();
            if (success) {
                fetchProductData();
            } else {
                popUpError("Please log in to view your buy later list.");
            }
        }

        if (!response.ok) {
            throw new Error("Failed to fetch products.");
        }

        const products = await response.json();
        displayProductData(products.products);
    } catch (error) {
        console.error("Error fetching product data:", error);

    } finally {

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
            if (success) {
                updateQuantity(sizeId, quantity);
            } else {
                popUpError("Please log in to update the quantity.");
            }
        }
        if (response.ok) {
            fetchProductData();
        } else {
            const data = await response.json();
            popUpError(data.message || "Failed to update quantity.");
        }
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

    products.forEach((product) => {
        const selectedColors = product.colorDtos.filter(color => color.isPreviouslySelected);

        if (selectedColors.length) {
            selectedColors.forEach((color) => {
                color.sizeDtos.forEach((size) => {
                    const sizeContainer = document.createElement("div");
                    sizeContainer.classList.add("size-container");

                    sizeContainer.innerHTML = `
                        <div class="size-block">
                            <div class="image-container">
                                ${color.imageDtos && color.imageDtos.length > 0
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
                                <div class="size-controls">
                                    <button class="decrement-btn" data-size-id="${size.sizeDtoId}" data-quantity="${size.quantityOrder - 1}">-</button>
                                    <input type="number" value="${size.quantityOrder}" readonly />
                                    <button class="increment-btn" data-size-id="${size.sizeDtoId}" data-quantity="${size.quantityOrder + 1}">+</button>
                                </div>
                            </div>
                        </div>
                    `;
                    container.appendChild(sizeContainer);
                });
            });
        }
    });

    // Attach event listeners for buttons
    attachQuantityControlListeners();
}

function attachQuantityControlListeners() {
    const decrementButtons = document.querySelectorAll(".decrement-btn");
    const incrementButtons = document.querySelectorAll(".increment-btn");

    decrementButtons.forEach((button) =>
        button.addEventListener("click", (e) => {
            const sizeId = e.target.dataset.sizeId;
            const quantity = parseInt(e.target.dataset.quantity, 10);
            updateQuantity(sizeId, quantity);
        })
    );

    incrementButtons.forEach((button) =>
        button.addEventListener("click", (e) => {
            const sizeId = e.target.dataset.sizeId;
            const quantity = parseInt(e.target.dataset.quantity, 10);
            updateQuantity(sizeId, quantity);
        })
    );
}



// Call the fetch function on page load
fetchProductData();
