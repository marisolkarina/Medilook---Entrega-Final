import { Router } from "express";

const router = Router();

router.get('/', (req,res)=>{
    res.render('realTimeProducts',{
        title: 'Productos Medilook'
    })
});

router.post('/', (req, res) => {
    try {
        let urlImagen;
        if (req.files && req.files.image2) {
            urlImagen = `/image/${req.files.image2[0].filename}`;
        } else if (req.files && req.files.image) {
            urlImagen = `/image/${req.files.image[0].filename}`;
        }

        // const urlImagen = `/image/${req.file.filename}`;
        res.json({success: true, urlImagen: urlImagen});
    } catch (err) {
        res.status(500).json({success: false, message: err.message });
    }
});

export default router;