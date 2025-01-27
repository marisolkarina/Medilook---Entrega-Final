const socket = io();

socket.on('home', (listaProductos) =>{
    document.getElementById('products-container').innerHTML = '';
    let productosVisualizados = '';

    listaProductos.forEach(producto => {
        productosVisualizados += `
            <div class="card col-md-4 m-3" style="width: 20rem;">
                <img src="${producto.urlImagen}" class="mt-3" alt="${producto.title}">
                <h5 class="card-title text-center mt-2">${producto.title}</h5>
                <h5 class="card-title text-center mt-2">${producto.price}</h5>
                <p>${producto.description}</p>
                <p>Categoria: ${producto.category}</p>
                <p>Género: ${producto.gender}</p>
                <p>Marca: ${producto.marca}</p>
                <p>Color: ${producto.color}</p>
            </div>
        `;
    });
    document.getElementById("products-container").innerHTML = productosVisualizados;
});