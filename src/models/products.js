import {model, Schema} from 'mongoose';

const productCollection = 'product';

const productSchema = new Schema({
    title: String,
    urlImagen: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    gender: String,
    marca: String,
    color: String
});

export const ProductModel = model(productCollection, productSchema);