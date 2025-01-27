import deleteFile from '../utils/file.js'

export class productManager {
    constructor(model) {
        this.model = model;
    }

    async getProducts() {
        try {
            const productos = await this.model.find();
            return productos;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async getProductById(id) {
        try {
            const productoBuscado = await this.model.findById(id);
            if (!productoBuscado) throw new Error("El producto no existe");
            return productoBuscado;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async addProduct(producto) {
        try {
            const newProduct = await this.model.create(producto);
            return newProduct;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async update(producto, id) {
        try {
            // borro la imagen anterior cuando actualizo producto
            let productoAnterior = await this.model.findById(id);
            deleteFile('src/public/'+productoAnterior.urlImagen);

            let productoActualizar = await this.model.findByIdAndUpdate(id, producto, {new: true});

            if (!productoActualizar) throw new Error("El producto no existe");
            return productoActualizar;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async delete(id) {
        try {
            // borro su imagen cuando elimino un producto
            let productoAnterior = await this.model.findById(id);
            deleteFile('src/public/'+productoAnterior.urlImagen);

            const productoEliminar = await this.model.findByIdAndDelete(id);
            if (!productoEliminar) throw new Error("El producto no existe");
            return productoEliminar;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async filterProducts(query) {
        try {
            const productos = await this.getProducts();
            let productosFiltrados =  productos;// valor inicial: todos los productos

            const filtros = {};

            // no sensible a mayusculas ni minusculas
            if (query) {
                if (query.gender) filtros.gender = { $regex: query.gender, $options: 'i'}
                if (query.category) filtros.category = { $regex: query.category, $options: 'i'}
                if (query.marca) filtros.marca = { $regex: query.marca, $options: 'i'}
                if (query.color) filtros.color = { $regex: query.color, $options: 'i'}

                productosFiltrados = this.model.find(filtros);
            }

           /*
            if (order) {
                if (order === 'alfabeticamente') {
                    productosFiltrados = productosFiltrados.sort((prod1, prod2) => prod1.title.localeCompare(prod2.title));
                } else if (order === 'precio-ascendente') {
                    productosFiltrados = productosFiltrados.sort((prod1, prod2) => prod1.price - prod2.price);
                } else if (order === 'precio-descendente') {
                    productosFiltrados = productosFiltrados.sort((prod1, prod2) => prod2.price - prod1.price);
                }
            }
*/
            if (productosFiltrados.length === 0) throw new Error("No hay productos con los filtros indicados.");
            return productosFiltrados;

        } catch (err) {
            throw new Error(err.message);
        }
    }
}

// export const productManager = new ProductManager(path.join(process.cwd(), "src/data/products.json"));