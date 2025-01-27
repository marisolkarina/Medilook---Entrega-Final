import { Router } from "express";
import { ProductModel } from "../models/products.js";
import { productManager } from '../managers/productManager.js';
import multer from 'multer';
import { storage } from '../utils/multer.js'

const router = Router();
const model = new productManager(ProductModel);

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

router.get("/", async (req, res) => {
    try {
        // let { gender, category, marca, color, order } = req.query;
        const query = req.query;

        // filtra productos por category, marca,color, gender en caso sea necesario
        // tambien puede ordenar
        // if (category || gender || marca || color || order) {
        if (query) {
            const productosFiltrados = await model.filterProducts(query);
            return res.status(200).json({ payload: productosFiltrados });
        }

        const productos = await model.getProducts();
        return res.status(200).json({ payload: productos });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



router.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const productoBuscado = await model.getProductById(pid);
        res.status(200).json({payload: productoBuscado});
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

router.post("/", multer({ storage: storage, fileFilter: fileFilter }).single("image"), async (req, res) => {
    try {
        const file = req.file;
        const body = req.body;
        const newProduct = {
            ...body,
            urlImagen: file.path.split('public')[1]
        }
        const producto = await model.addProduct(newProduct);
        res.status(200).json({ payload: producto });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const prodEliminar = await model.delete(pid);
        res.status(200).json({ payload: `El producto con id: ${prodEliminar.id} ha sido eliminado` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.put("/:pid",  multer({ storage: storage, fileFilter: fileFilter }).single("image"), async (req, res) => {
    try {
        const { pid } = req.params;
        
        const prod = {
            ...req.body,
            ...(req?.file?.path && { urlImagen: req.file.path.split('public')[1] })
        };
        const prodAct = await model.update(prod, pid);
        res.status(200).json({payload: prodAct});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




export default router;
