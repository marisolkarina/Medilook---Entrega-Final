import multer from 'multer';
import __dirname from './utils.js';
import { dirname } from 'node:path';

export const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, dirname(__dirname)+'/public/image');
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});