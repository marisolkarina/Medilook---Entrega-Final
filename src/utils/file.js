import fs from 'node:fs'

const deleteFile = (rutaArchivo) => {
    fs.unlink(rutaArchivo, (err) => {
        if (err) {
            throw (err);
        }
    })
}

export default deleteFile;