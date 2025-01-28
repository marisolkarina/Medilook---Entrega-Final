import {model, Schema} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

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

productSchema.plugin(mongoosePaginate);

export const ProductModel = model(productCollection, productSchema);