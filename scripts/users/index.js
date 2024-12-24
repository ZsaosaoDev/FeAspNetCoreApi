const slider = () => {
    const offsetWidthSlide = document.getElementById('slider').offsetWidth;
    const offsetWidthItem = document.querySelectorAll('#slider .item')[0]?.offsetWidth;
    const itemMargin = 20;
    const remainingPhotos = document.querySelectorAll('#slider .item')?.length - Math.floor((offsetWidthSlide + itemMargin) / (offsetWidthItem + itemMargin));

    const btnNext = document.getElementById('next');
    const btnPrev = document.getElementById('prev');

    let current = remainingPhotos;
    const items = document.querySelectorAll('#slider .item');
    let currentPosition = 0;

    function updatePositions() {
        let position = currentPosition;
        items.forEach((item) => {
            item.style.left = `${position}px`;
            position += offsetWidthItem + itemMargin;
        });
    }

    btnNext.onclick = function () {
        if (current > 0) {
            current--;
            btnPrev.style.display = 'block';
            currentPosition -= (offsetWidthItem + itemMargin); // Di chuyển sang trái
            updatePositions();

            if (current == 0) {
                btnNext.style.display = 'none';
            }
        }
    }

    btnPrev.onclick = function () {
        if (current < remainingPhotos) {
            current++;
            btnNext.style.display = 'block';
            currentPosition += (offsetWidthItem + itemMargin); // Di chuyển sang phải
            updatePositions();

            if (current == remainingPhotos) {
                btnPrev.style.display = 'none';
            }
        }
    }

    updatePositions();
}


const getCategoryProduct = async () => {

    const response = await fetch('https://localhost:7284/api/productcategories', {
        method: 'GET',
        headers: {
            'Accept': 'Application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }

    const data = await response.json();
    displayCategoryProduct(data);

}

const displayCategoryProduct = (data) => {
    const slider = document.getElementById('slider');
    console.log(data);
    data.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
            <img src="data:image/jpeg;base64,${item.picture}" alt="${item.name}">
        `;
        slider.appendChild(div);

        div.onclick = () => {
            clickItem(item.name);
        }
    });

};

const clickItem = (categoryName) => {
    window.location.href = `./productlist.html?categoryName=${categoryName}`;
}




const main = async () => {
    await getCategoryProduct();
    slider();
}
main();
