import express from 'express';
import handlebars from 'express-handlebars';
import { mongoConnection } from "./connection/mongo.js";
import __dirname from './utils/utils.js';
import { dirname } from 'node:path';
import homeRoute from './routes/homeRouter.js';
import realtimeproducts from './routes/realTimeProductsRouter.js';
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import multer from 'multer';
import { storage } from './utils/multer.js';
import { Server } from 'socket.io';
import { productManager } from './managers/productManager.js';

const PORT = 8080;
const app = express();
mongoConnection();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

const httpServer = app.listen(PORT, () => {
    console.log("Server on port", PORT);
});

app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}));
app.set('views', dirname(__dirname) + '/views');
app.set('view engine', 'hbs');
app.use(express.static(dirname(__dirname) + '/public'));

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/webp'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// app.use(multer({ storage: storage, fileFilter: fileFilter }).single('image'));

app.use(multer({ storage: storage, fileFilter: fileFilter }).fields([
    { name: 'image', maxCount: 1 },
    { name: 'image2', maxCount: 1 }
]));

app.use('/home', homeRoute);
app.use('/realtimeproducts', realtimeproducts);

const ioServer = new Server(httpServer);

ioServer.on('connection', async (socket) => {
    console.log('nuevo user conectado', socket.id);

    const productos = await productManager.getProducts();
    socket.emit('home', productos);
    socket.emit('realtime', productos);
    socket.on('nuevo-producto', async(newProduct)=>{
        await productManager.addProduct(newProduct);
        const newList = await productManager.getProducts();
        // emite la lista actualizada de los productos a todos los clientes conectados
        ioServer.emit('realtime', newList);
    });

    socket.on('update-product', async (producto)=>{
        await productManager.update(producto, producto.id);
        const newList = await productManager.getProducts();
        ioServer.emit('realtime',newList);
    })

    socket.on('delete-product', async(id) => {
        await productManager.delete(id);
        const newList = await productManager.getProducts();
        // emite la lista actualizada de los productos a todos los clientes conectados
        ioServer.emit('realtime', newList);
    });
});