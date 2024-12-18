const productDetails = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    let selectedColor = null;
    let selectedSize = null;
    let quantity = 1;
    let product = null;

    async function getProductDetails() {
        const url = `https://localhost:7284/api/getProductById?id=${id}`;
        try {
            const response = await fetch(url, {
                method: "GET",
                credentials: "include", // Gửi cookie kèm theo yêu cầu
            });
            if (!response.ok) {
                throw new Error(`Không tìm thấy sản phẩm với ID: ${id}`);
            }

            product = await response.json();

            if (product) {
                product.colorDtos.forEach(color => {
                    color.productId = id;
                    color.sizeDtos.forEach(size => {
                        size.colorId = color.colorDtoId;
                    });

                    // Cập nhật lại colorId của từng hình ảnh cho đúng với colorDtoId của màu
                    color.imageDtos.forEach(image => {
                        image.colorId = color.colorDtoId;
                    });
                });

                selectedColor = product.colorDtos[0];
                selectSizeForColor(selectedColor);

                displayProductDetails(product);
                logProductDetails();
            } else {
                document.getElementById('productDetails').innerHTML = '<p>No product details available.</p>';
            }
        } catch (error) {
            document.getElementById('productDetails').innerHTML = `<p>Error: ${error.message}</p>`;
        }
    }

    function displayProductDetails(product) {
        const container = document.getElementById('productDetails');
        container.innerHTML = `
            <div id="productName">${product.name}</div>
    
    ${product.discount > 0 ? `
        <p class="original-price">$${product.price.toFixed(2)}</p>` : ''}
            <div class="price">
                <div class="price_sale">${product.price}&#273;</div>
                <div class="discount">-${product.discount}%</div>
            </div>
    
            <div id="selectedColorText">Màu sắc: <span> ${product.colorDtos[0]?.name || 'Chưa chọn'} </span></div>
            <div class="color-buttons-container">
                ${product.colorDtos.map((color, index) => `
                   <div class="color-button-item">
                        <button 
                            class="btn color-btn ${index === 0 ? 'active' : ''}"
                            style="background-color: ${color.hexCode || 'gray'}; " 
                            data-color-name="${color.name}" 
                            data-color-id="${color.colorDtoId}">
                        </button>
                   </div>
                `).join('')}
            </div>
           
    
            <div id="selectedSizeText"><span> ${product.colorDtos[0]?.sizeDtos[0] || 'Chưa chọn'} </span></div>
            <div id="sizeButtons"></div>
            <div id="thumbnailsItem"></div>
            <div class="btnIncreaseDecrease d-flex justify-content-between align-items-center">
                <div 
                    class="mx-auto d-flex justify-content-around align-items-center rounded-pill me-2 sl-box" 
                    style="width: 100px; background-color: #ffffff; border: 1px solid black;">
                        <i class="fas fa-minus" onclick="decreaseQuantity()"></i>
                        <span id="quantity" class="fw-bold">1</span>
                        <i class="fas fa-plus" onclick="increaseQuantity()"></i>
                </div>
    
                <div style="flex: 1;" class="col-auto">
                <button
                    class="addToCard mx-auto d-flex justify-content-center align-items-center rounded-pill order-button cart-box popup">
                        <i class="fa-solid fa-cart-shopping mx-2"></i>
                    <span class="fw-bold">Thêm vào giỏ hàng</span>
                </button>
            </div>
            </div>
           
           
        `;

        const initialColor = product.colorDtos[0];
        updateThumbnails(initialColor);
        updateSizes(initialColor);

        const colorButtons = document.querySelectorAll('.color-btn');
        colorButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const colorId = event.target.dataset.colorId;
                selectedColor = product.colorDtos.find(color => color.colorDtoId == colorId);

                selectSizeForColor(selectedColor);
                updateThumbnails(selectedColor);
                updateSizes(selectedColor);
                updateColorDisplay(selectedColor.name);
                updateSizeDisplay(selectedSize ? selectedSize.name : 'Chưa chọn');

                colorButtons.forEach(btn => btn.classList.remove('active'));
                event.target.classList.add('active');

                logProductDetails();
            });
        });
    }

    function updateThumbnails(color) {
        const thumbnailContainer = document.getElementById('thumbnailsItem');
        const imgMain = document.getElementById('img_main');
        thumbnailContainer.innerHTML = '';  // Xóa các thumbnail cũ trước khi thêm mới

        if (color && color.imageDtos && color.imageDtos.length > 0) {
            const filteredImages = color.imageDtos.filter(image => image.colorId === color.colorDtoId);

            if (filteredImages.length > 0) {
                imgMain.src = `data:image/jpeg;base64,${filteredImages[0].data}`;

                thumbnailContainer.classList.add('thumbnail-container');

                filteredImages.forEach(image => {
                    const imgElement = document.createElement('img');
                    imgElement.src = `data:image/jpeg;base64,${image.data}`;
                    imgElement.style = 'object-fit: contain;';
                    imgElement.classList.add('img-fluid');

                    const thumbnailItem = document.createElement('div');
                    thumbnailItem.classList.add('thumbnail-item');
                    thumbnailItem.appendChild(imgElement);

                    thumbnailItem.addEventListener('click', () => {
                        imgMain.src = `data:image/jpeg;base64,${image.data}`;
                    });

                    thumbnailContainer.appendChild(thumbnailItem);
                });
            } else {
                thumbnailContainer.innerHTML = '<p>No images available for this color.</p>';
            }
        } else {
            thumbnailContainer.innerHTML = '<p>No images available for this color.</p>';
        }
    }

    function updateSizes(color) {
        const sizeButtonsContainer = document.getElementById('sizeButtons');
        sizeButtonsContainer.innerHTML = '';

        if (color && color.sizeDtos && color.sizeDtos.length > 0) {
            selectedSize = color.sizeDtos.reduce((minSize, currentSize) => {
                return currentSize.sizeDtoId < minSize.sizeDtoId ? currentSize : minSize;
            });

            color.sizeDtos.forEach(size => {
                const sizeButton = document.createElement('button');
                sizeButton.classList.add('btn', 'btn-size', 'size');
                sizeButton.textContent = size.name;
                sizeButton.dataset.sizeName = size.name;
                sizeButton.dataset.sizeId = size.sizeDtoId;

                sizeButton.addEventListener('click', (event) => {
                    selectedSize = color.sizeDtos.find(s => s.sizeDtoId == event.target.dataset.sizeId);
                    updateSizeDisplay(selectedSize.name);

                    const sizeButtons = document.querySelectorAll('.size');
                    sizeButtons.forEach(btn => btn.classList.remove('active'));
                    event.target.classList.add('active');

                    logProductDetails();
                });

                sizeButtonsContainer.appendChild(sizeButton);
            });
        } else {
            sizeButtonsContainer.innerHTML = '<p>No sizes available for this color.</p>';
            selectedSize = null;
        }

        updateSizeDisplay(selectedSize ? selectedSize.name : 'Chưa chọn');
    }

    function selectSizeForColor(color) {
        if (color.sizeDtos && color.sizeDtos.length > 0) {
            selectedSize = color.sizeDtos.reduce((minSize, currentSize) => {
                return currentSize.sizeDtoId < minSize.sizeDtoId ? currentSize : minSize;
            });
        } else {
            selectedSize = null;
        }
    }

    function updateColorDisplay(colorName) {
        const selectedColorText = document.getElementById('selectedColorText');
        selectedColorText.innerHTML = `Màu sắc:<span> ${colorName}</span>`;
        quantity = 1;
    }

    function updateSizeDisplay(sizeName) {
        const selectedSizeText = document.getElementById('selectedSizeText');
        selectedSizeText.innerHTML = `Kích thướt: <span>${sizeName}</span>`;
    }

    function decreaseQuantity() {
        if (quantity > 1) {
            quantity--;
            updateQuantityDisplay(quantity);
            logProductDetails();
        }
    }

    function increaseQuantity() {
        if (selectedSize && selectedSize.stock > quantity) {
            quantity++;
            updateQuantityDisplay(quantity);
            logProductDetails();
        } else {
            alert('Số lượng vượt quá kho hàng');
        }
    }

    function updateQuantityDisplay(quantity) {
        document.getElementById('quantity').textContent = quantity;
    }

    function logProductDetails() {
        console.log('Tên sản phẩm:', product.name);
        console.log('Giá sản phẩm:', product.price);
        console.log('Object Color:', selectedColor);
        console.log('Object Size:', selectedSize);
        console.log('Số lượng sản phẩm:', quantity);
        console.log('');
    }

    getProductDetails();
}

productDetails();