import mongoose from 'mongoose';

export const mongoConnection = async () => {
    try{
        await mongoose.connect('mongodb+srv://marisol:secreto@cluster0.71urh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {dbName: 'medilook'})
        console.log('Base de datos conectada')
    } catch (e){
        console.log('Error al conectarse a la BBDD')
    }
}