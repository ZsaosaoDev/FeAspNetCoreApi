import { popUp } from "../service.js";
const productList = () => {
    async function fetchProductDetails() {
        // Lấy URL hiện tại
        const urlParams = new URLSearchParams(window.location.search);

        // Lấy giá trị từ URL
        const keyword = urlParams.get('name') || '';
        const pageNumber = urlParams.get('pageNumber') || 1;

        const url = `https://localhost:7284/api/products/pagination?name=${keyword}&pageNumber=${pageNumber}`;
        document.getElementById('loading').style.display = 'block';

        try {
            const response = await fetch(url, {
                method: "GET",
                credentials: "include", // Gửi cookie kèm theo yêu cầu
            });
            const data = await response.json();
            const products = data?.items || [];
            console.log(data);


            const container = document.getElementById('productDetails');
            if (products.length > 0) {
                displayProductDetails(products);

                const page = {
                    totalPages: Math.ceil(data.totalItems / data.pageSize), // Làm tròn lên tổng số trang
                    pageNo: data.pageNumber,   // Trang hiện tại
                    keyword: keyword     // Từ khóa tìm kiếm (nếu có)
                };

                generatePagination(page);
                colorChange();
                size();
                showPopUp();
                toBuyLater();


            } else {
                container.innerHTML = '<p>No products available.</p>';
            }
        } catch (error) {
            document.getElementById('productDetails').innerHTML = `<p>Error: ${error.message}</p>`;
        } finally {
            // Ẩn spinner sau khi tải xong
            // document.getElementById('loading').style.display = 'none';
        }


    }


    function displayProductDetails(products) {
        const container = document.getElementById('productDetails');
        container.innerHTML = ''; // Clear existing content

        products.forEach(product => {
            const productHTML = `
            <div class="col-md-3">
                    <a href="productDetail.html?id=${product.productDtoId}" class="product-link">
                        <div class="product-item">
                            ${product.colorDtos && product.colorDtos.length > 0
                    ? product.colorDtos.map((color, colorIndex) => `
                                    <div class="imageAndSize-container ${colorIndex === 0 ? 'active' : ''}">
                                        <div class="image-container">
                                            ${color.imageDtos && color.imageDtos.length > 0
                            ? `
                                                    <img class="image-1" 
                                                        src="data:image/jpeg;base64,${color.imageDtos[0]?.data || ''}" 
                                                        alt="${color.name}" 
                                                        width="100" 
                                                        height="100" 
                                                        onerror="this.src='../../assets/images/defaults/NoImageAvailable.jpg'">
                                                    <img class="image-2" 
                                                        src="${color.imageDtos[1]
                                ? `data:image/jpeg;base64,${color.imageDtos[1]?.data}`
                                : '../../assets/images/defaults/NoImageAvailable.jpg'}" 
                                                        alt="${color.name}" 
                                                        width="100" 
                                                        height="100" 
                                                        onerror="this.src='../../assets/images/defaults/NoImageAvailable.jpg'">
                                                `
                            : `
                                                    <img class="image-1" 
                                                        src="../../assets/images/defaults/NoImageAvailable.jpg" 
                                                        alt="No Image Available" 
                                                        width="100" 
                                                        height="100">
                                                    <img class="image-2" 
                                                        src="../../assets/images/defaults/NoImageAvailable.jpg" 
                                                        alt="No Image Available" 
                                                        width="100" 
                                                        height="100">
                                                `}
                                        </div>
                                        <div class="size-list">
                                            ${color.sizeDtos.map(size => `
                                                <button class="option-size" data-sizeId="${size.sizeDtoId}">${size.name}</button>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')
                    : `
                                    <div class="imageAndSize-container active">
                                        <div class="image-container">
                                            <img class="image-1" 
                                                src="../../assets/images/defaults/NoImageAvailable.jpg" 
                                                alt="No Image Available" 
                                                width="100" 
                                                height="100">
                                            <img class="image-2" 
                                                src="../../assets/images/defaults/NoImageAvailable.jpg" 
                                                alt="No Image Available" 
                                                width="100" 
                                                height="100">
                                        </div>
                                    </div>
                                `}
                            <div class="color-container">
                                ${product.colorDtos && product.colorDtos.length > 0
                    ? product.colorDtos.map((color, colorIndex) => `
                                        <div class="color-item ${colorIndex === 0 ? 'active' : ''}">
                                            <div class="color-name">${color.name}</div>
                                            <div class="hex-code" style="background-color: ${color.hexCode};"></div>
                                        </div>
                                    `).join('')
                    : ''}
                            </div>
                            <div class="productInfo">
                                <h3 class="name-product">${product.name}</h3>
                                <div class="priceDiv">
                                    <p class="price">
                                        $${(product.price - (product.price * product.discount / 100)).toFixed(2)}
                                    </p>
                                    <p class="discount">${product.discount}%</p>
                                    ${product.discount > 0
                    ? `<p class="original-price">$${product.price.toFixed(2)}</p>`
                    : ''}
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            `;
            container.innerHTML += productHTML;

            // Thêm class "visible" với độ trễ để tạo hiệu ứng
            const productItems = document.querySelectorAll('.product-item');
            productItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 100); // Hiệu ứng theo từng sản phẩm
            });




        });
    }



    const colorChange = () => {
        const productItems = document.querySelectorAll('.product-item');

        productItems.forEach((productItem) => {
            const colorItems = productItem.querySelectorAll('.color-item'); // Danh sách màu sắc
            const imageAndSizeContainers = productItem.querySelectorAll('.imageAndSize-container'); // Danh sách ảnh

            colorItems.forEach((colorItem, index) => {
                colorItem.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Xóa class 'active' khỏi tất cả color-items và image-containers
                    colorItems.forEach(item => item.classList.remove('active'));
                    imageAndSizeContainers.forEach(container => container.classList.remove('active'));

                    // Thêm class 'active' cho color-item và image-container được chọn
                    colorItem.classList.add('active');
                    imageAndSizeContainers[index].classList.add('active');
                });
            });
        });
    };


    const size = () => {
        const productItems = document.querySelectorAll('.product-item');

        productItems.forEach((productItem) => {
            // nếu không có hàm gọi này nó tham chiếu tới thằng cũ mà lúc này đã bị none display nên không hiện
            const setSizeListEvents = () => {
                // Lấy container mới có lớp active
                const activeContainer = productItem.querySelector('.imageAndSize-container.active');
                if (!activeContainer) return;

                const sizeList = activeContainer.querySelector('.size-list');

                productItem.addEventListener('mouseenter', () => {
                    if (sizeList) {
                        sizeList.style.display = 'block';
                        sizeList.style.animation = 'hoverProduct-Product 0.8s forwards';
                    }
                });

                productItem.addEventListener('mouseleave', () => {
                    if (sizeList) {
                        sizeList.style.animation = 'notHoverProduct-Product 0.8s forwards';
                        sizeList.addEventListener('animationend', function handleAnimationEnd(event) {
                            if (event.animationName === 'notHoverProduct-Product') {
                                sizeList.style.display = 'none';
                                sizeList.removeEventListener('animationend', handleAnimationEnd);
                            }
                        });
                    }
                });
            };

            setSizeListEvents();

            // Reset lại sự kiện khi click vào color-item
            const colorItems = productItem.querySelectorAll('.color-item');
            colorItems.forEach(() => {
                productItem.addEventListener('click', () => {
                    setSizeListEvents(); // Gán lại sự kiện cho container mới
                });
            });
        });
    };




    function generatePagination(page) {
        const paginationList = document.getElementById('pagination-list');
        paginationList.innerHTML = ''; // Xóa nội dung cũ

        const currentPage = page.pageNo;
        const totalPages = page.totalPages;
        const keyword = page.keyword || '';

        const range = 2; // Số trang hiển thị mỗi bên
        let startPage = currentPage - range;
        let endPage = currentPage + range;

        // Điều chỉnh startPage và endPage
        if (startPage < 1) {
            endPage += 1 - startPage;
            startPage = 1;
        }
        if (endPage > totalPages) {
            startPage -= endPage - totalPages;
            endPage = totalPages;
        }
        if (startPage < 1) startPage = 1;

        // Tạo nút "Previous"
        if (currentPage > 1) {
            const prev = document.createElement('li');
            prev.innerHTML = `<div >Previous</div>`;
            prev.addEventListener('click', () => {
                updateURLAndFetch(keyword, currentPage - 1);
            });
            paginationList.appendChild(prev);
        }

        // Tạo các số trang
        for (let i = startPage; i <= endPage; i++) {
            const pageItem = document.createElement('li');
            pageItem.innerHTML = `<div  class="${i === currentPage ? 'active' : ''}">${i}</div>`;
            pageItem.addEventListener('click', () => {
                updateURLAndFetch(keyword, i);
            });
            paginationList.appendChild(pageItem);
        }

        // Tạo nút "Next"
        if (currentPage < totalPages) {
            const next = document.createElement('li');
            next.innerHTML = `<div >Next</div>`;
            next.addEventListener('click', () => {
                updateURLAndFetch(keyword, currentPage + 1);
            });
            paginationList.appendChild(next);
        }
    }

    // Cập nhật URL và gọi lại fetchProductDetails
    function updateURLAndFetch(keyword, newPageNumber) {
        const url = new URL(window.location);
        url.searchParams.set('name', keyword);
        url.searchParams.set('pageNumber', newPageNumber);

        window.location.href = url;

        // Cuộn mượt về đầu trang
        window.scrollTo({ top: 0, behavior: 'smooth' });

    }

    const search = () => {

        const changeUrl = () => {
            const searchInput = document.getElementById('searchInput');
            const keyword = searchInput.value.trim();
            updateURLAndFetch(keyword, 1);


        }
        const searchBtn = document.getElementById('searchBtn');
        searchBtn.addEventListener('click', () => {
            changeUrl();
        });

        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') { // Check if Enter key is pressed
                changeUrl();
            }
        });
    }


    const getSearchInputValue = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const keyword = urlParams.get('name') || '';
        const searchInput = document.getElementById('searchInput');
        searchInput.value = keyword;
    }

    const toBuyLater = () => {

        const optionSizes = document.querySelectorAll('.option-size');

        optionSizes.forEach((optionSize) => {

            optionSize.addEventListener('click', (e) => {
                e.preventDefault();

                const sizeId = optionSize.getAttribute('data-sizeId');
                console.log(sizeId);

                fetch('https://localhost:7284/SaveToBuyLater', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(parseInt(sizeId)),
                })
                    .then(response => {

                        if (!response.ok) {
                            throw new Error('Failed to add to buy later.');
                        }
                        return response.json();
                    });

            });

        });

    };


    const showPopUp = () => {
        const optionSizes = document.querySelectorAll('.option-size');


        optionSizes.forEach((optionSize) => {

            optionSize.addEventListener('click', (e) => {
                e.preventDefault();

                const productItem = optionSize.closest('.product-item');

                const nameProduct = productItem.querySelector('.name-product').textContent; // pop up name

                const imageAndSizeContainerActive = productItem.querySelector('.imageAndSize-container.active');

                const image = imageAndSizeContainerActive.querySelector('.image-1'); // pop up image

                const colorItemActive = productItem.querySelector('.color-item.active');

                const colorName = colorItemActive.querySelector('.color-name').textContent; // pop up color name

                const price = productItem.querySelector('.price').textContent; // pop up price




                popUp(image.src, nameProduct, colorName, optionSize.textContent, price);

            });


        });
    }





    const main = async () => {
        await fetchProductDetails();
        search();
        getSearchInputValue();
        colorChange();
    }
    main();
}

productList();









