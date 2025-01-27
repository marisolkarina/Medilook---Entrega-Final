const socket = io();

socket.on('realtime', (productos) => {
    document.getElementById('products-container-rtp').innerHTML = '';

    let productosVisualizados = '';

    productos.forEach(producto => {
        productosVisualizados += `
            <div class="card col-md-4 m-3" style="width: 20rem;">
                <img src="${producto.urlImagen}" class="mt-3" alt="${producto.title}">
                <p>ID: ${producto.id}</p>
                <h5 class="card-title text-center mt-2">${producto.title}</h5>
                <h5 class="card-title text-center mt-2">S/. ${producto.price}</h5>
                <p>${producto.description}</p>
                <p>Categoria: ${producto.category}</p>
                <p>Género: ${producto.gender}</p>
                <p>Marca: ${producto.marca}</p>
                <p>Color: ${producto.color}</p>
                <p>Código: ${producto.code}</p>
                <p>Stock: ${producto.stock}</p>
                <input type="hidden" value="${producto.id}" id="idProducto">
                <button id="eliminarProd" class="btn btn-danger w-50 mx-1">Eliminar</button>
            </div>
        `;
    });

    document.getElementById("products-container-rtp").innerHTML = productosVisualizados;
});

const addProduct = () => {
    const formData = new FormData();

    formData.append('title', document.querySelector('#title').value);
    formData.append('description', document.querySelector('#description').value);
    formData.append('price', document.querySelector('#price').value);
    formData.append('code', document.querySelector('#code').value);
    formData.append('stock', document.querySelector('#stock').value);
    formData.append('category', document.querySelector('#category').value);
    formData.append('marca', document.querySelector('#marca').value);
    formData.append('color', document.querySelector('#color').value);
    formData.append('gender', document.querySelector('#gender').value);
    formData.append('image', document.querySelector('#image').files[0]);

    fetch('/realtimeproducts', {
        method: 'POST',
        body: formData
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                const { urlImagen } = data;

                const producto = {
                    title: formData.get('title'),
                    description: formData.get('description'),
                    price: Number(formData.get('price')),
                    code: formData.get('code'),
                    stock: Number(formData.get('stock')),
                    category: formData.get('category'),
                    marca: formData.get('marca'),
                    color: formData.get('color'),
                    gender: formData.get('gender'),
                    urlImagen: urlImagen
                };

                console.log(producto);

                socket.emit('nuevo-producto', producto);

                document.querySelector('#title').value = "";
                document.querySelector('#description').value = "";
                document.querySelector('#price').value = "";
                document.querySelector('#code').value = "";
                document.querySelector('#stock').value = "";
                document.querySelector('#category').value = "";
                document.querySelector('#marca').value = "";
                document.querySelector('#color').value = "";
                document.querySelector('#category').value = "";
            } else {
                console.log('Error al subir la imagen.');
            }
        });
}

document.querySelector('#formCrearProducto').addEventListener('submit', (event) => {
    event.preventDefault();
    addProduct();
});

document.getElementById('products-container-rtp').addEventListener('click', (event) => {
    if (event.target && event.target.id === 'eliminarProd') {
        const idProducto = event.target.previousElementSibling.value;
        deleteProduct(idProducto);
    }
});

const deleteProduct = (id) => {
    socket.emit('delete-product', id);
}


document.querySelector('#formModificarProducto').addEventListener('submit', (event) => {
    event.preventDefault();
    updateProduct();
});


const updateProduct = () => {
    const formData = new FormData();

    formData.append('id', document.querySelector('#id2').value);
    formData.append('title', document.querySelector('#title2').value);
    formData.append('description', document.querySelector('#description2').value);
    formData.append('price', document.querySelector('#price2').value);
    formData.append('code', document.querySelector('#code2').value);
    formData.append('stock', document.querySelector('#stock2').value);
    formData.append('category', document.querySelector('#category2').value);
    formData.append('marca', document.querySelector('#marca2').value);
    formData.append('color', document.querySelector('#color2').value);
    formData.append('gender', document.querySelector('#gender2').value);
    formData.append('image', document.querySelector('#image2').files[0]);

    fetch('/realtimeproducts', {
        method: 'POST',
        body: formData
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                const { urlImagen } = data;

                const producto = {
                    id: formData.get('id'),
                    title: formData.get('title'),
                    description: formData.get('description'),
                    price: Number(formData.get('price')),
                    code: formData.get('code'),
                    stock: Number(formData.get('stock')),
                    category: formData.get('category'),
                    marca: formData.get('marca'),
                    color: formData.get('color'),
                    gender: formData.get('gender'),
                    urlImagen: urlImagen
                };

                console.log(producto);

                socket.emit('update-product', producto);

                document.querySelector('#id2').value = "";
                document.querySelector('#title2').value = "";
                document.querySelector('#description2').value = "";
                document.querySelector('#price2').value = "";
                document.querySelector('#code2').value = "";
                document.querySelector('#stock2').value = "";
                document.querySelector('#category2').value = "";
                document.querySelector('#marca2').value = "";
                document.querySelector('#color2').value = "";
                document.querySelector('#category2').value = "";
            } else {
                console.log('Error al subir la imagen.');
            }
        });
}