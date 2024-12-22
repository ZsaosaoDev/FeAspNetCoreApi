document.getElementById('addColor').addEventListener('click', () => {
    const colorGroup = document.createElement('div');
    colorGroup.className = 'color-group';
    colorGroup.innerHTML = `
        <label>Color Name:</label>
        <input type="text" class="colorName" required>

        <label>Hex Code:</label>
        <input type="color" class="hexCode" required>

        <div class="sizes">
            <h3>Sizes</h3>
            <button class="addSize btn btn-primary">Add Size</button>
        </div>

        <div class="images">
            <h3>Images</h3>
            <button class="addImage btn btn-primary">Add Image</button>
            <input type="file" class="imageFile" accept="image/*" multiple>
        </div>
        <button class="removeColor btn btn-danger">Remove Color</button>
    `;

    // Add to colors section
    document.getElementById('colorsSection').appendChild(colorGroup);

    // Add event listeners for new buttons
    setupEventListenersForColor(colorGroup);
});

// Initialize event listeners for dynamically added elements
function setupEventListenersForColor(colorGroup) {
    // Add size to the color group
    colorGroup.querySelector('.addSize').addEventListener('click', () => {
        const sizeGroup = document.createElement('div');
        sizeGroup.className = 'size-group';
        sizeGroup.innerHTML = `
            <label>Size Name:</label>
            <input type="text" class="sizeName" required>

            <label>Stock:</label>
            <input type="number" class="stock" required>

            <button class="removeSize btn btn-danger">Remove Size</button>
        `;
        colorGroup.querySelector('.sizes').appendChild(sizeGroup);

        // Add event listener for removing the size
        sizeGroup.querySelector('.removeSize').addEventListener('click', () => {
            sizeGroup.remove();
        });
    });

    // Remove the entire color group
    colorGroup.querySelector('.removeColor').addEventListener('click', () => {
        colorGroup.remove();
    });
}

// Submit Form
document.getElementById('productForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Build the ProductDto object
    const productData = {
        name: document.getElementById('name').value,
        price: parseFloat(document.getElementById('price').value),
        discount: parseFloat(document.getElementById('discount').value || 0),
        categoryProductDtoId:  parseInt(document.getElementById('category')?.value),
        colorDtos: []
    };

    const colorGroups = document.querySelectorAll('.color-group');
    for (const colorGroup of colorGroups) {
        const colorData = {
            name: colorGroup.querySelector('.colorName').value,
            hexCode: colorGroup.querySelector('.hexCode').value,
            sizeDtos: [],
            imageDtos: []
        };

        const sizeGroups = colorGroup.querySelectorAll('.size-group');
        for (const sizeGroup of sizeGroups) {
            colorData.sizeDtos.push({
                name: sizeGroup.querySelector('.sizeName').value,
                stock: parseInt(sizeGroup.querySelector('.stock').value)
            });
        }

        const imageInput = colorGroup.querySelector('.imageFile');
        if (imageInput.files.length > 0) {
            for (const file of imageInput.files) {
                const base64Data = await toBase64(file); // Convert each file to Base64
                colorData.imageDtos.push({ data: base64Data });
            }
        }

        productData.colorDtos.push(colorData);
    }

    console.log('Sending Product Data:', productData);

    try {
        const response = await fetch(apiAddProduct, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData), // Send as JSON
        });

        if (response.ok) {
            alert('Product added successfully!');
        } else {
            const error = await response.json();
            console.error('Server Error:', error);
            alert('Failed to add product.');
        }
    } catch (error) {
        console.error('Error:', error);
    }

});

// Convert file to Base64
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

const apiAddProduct = "https://localhost:7284/api/products";

const apiGetAllProductCategory = "https://localhost:7284/api/productcategories";

const ProductCategry = document.getElementById('category');
try {
    fetch(apiGetAllProductCategory)
        .then(response => response.json())
        .then(data => {
            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.text = category.name;
                ProductCategry.appendChild(option);
            });
        });
} catch (error) {

}


const newCategory = document.getElementById('newCategory');
const optionCategory = document.getElementById('optionCategory');




document.getElementById("optionCategory").addEventListener("change", () => {
    console.log(document.getElementById("category").value);
});