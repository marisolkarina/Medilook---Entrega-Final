import fs from "node:fs";
import crypto from 'crypto';
import path from 'path';
import { productManager } from './productManager.js';

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const carritos = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(carritos);
              } else return [];
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async createCart() {
        try {
            const carrito = {
                id: crypto.randomBytes(10).toString('hex'),
                items: [],
                precioTotal: 0
            };
            const carritosActuales = await this.getCarts();
            carritosActuales.push(carrito);
            await fs.promises.writeFile(this.path, JSON.stringify(carritosActuales));
            return carrito;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async getCartById(id) {
        try {
            const carritos = await this.getCarts();
            const carritoBuscado = carritos.find((c) => c.id === id);
            if (!carritoBuscado) throw new Error("El carrito no existe");
            return carritoBuscado;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async addProductToCart(cid, pid, quantityProd) {
        try {
            const productoAgregar = await productManager.getProductById(pid);
            if (!productoAgregar) throw new Error('producto no existe');

            let carritos = await this.getCarts();

            const carritoExistente = await this.getCartById(cid);
            if(!carritoExistente) throw new Error('cart not exists');

            const prodExistenteEnCarrito = carritoExistente.items.find((item) => item.id === pid);

            //Obtenenmos precio unitario del producto
            let precioProd = productoAgregar.price;

            if (!prodExistenteEnCarrito) {
                const producto = {
                    id: pid,
                    quantity: 1
                }
                carritoExistente.items.push(producto);
            } else {
                prodExistenteEnCarrito.quantity += parseInt(quantityProd);
            }

            //Actualizamos el precio total del carrito
            carritoExistente.precioTotal += precioProd*parseInt(quantityProd);

            const carritosActualizados = carritos.map((cart) => {
                if (cart.id === cid) {
                    return carritoExistente;
                }
                return cart;
            });

            await fs.promises.writeFile(this.path, JSON.stringify(carritosActualizados));
            return carritoExistente;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async update(producto, id) {
        try {
           
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async delete(id) {
        try {
            
        } catch (err) {
            throw new Error(err.message);
        }
    }

}

export const cartManager = new CartManager(path.join(process.cwd(), "src/data/carts.json"));