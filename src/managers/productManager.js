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

    async filterProducts(opcion, query) {
        try {

            const filtros = {};

            if (query.gender) {
                if (query.gender.toLowerCase() === 'f' || query.gender.toLowerCase() === 'm') {
                    filtros.$or = [
                        { gender: { $regex: query.gender, $options: 'i' } },
                        //solo femenino o solo masculino incluye unisex
                        { gender: { $regex: 'u', $options: 'i' } },
                    ];
                } else {
                    filtros.gender = { $regex: query.gender, $options: 'i' }
                }
            }
            if (query.category) filtros.category = { $regex: query.category, $options: 'i'}
            if (query.marca) filtros.marca = { $regex: query.marca, $options: 'i'}
            if (query.color) filtros.color = { $regex: query.color, $options: 'i'}

            const productos = await this.model.paginate(filtros, opcion)

            return productos;
        } catch (err) {
            throw new Error(err.message);
        }
    }
}