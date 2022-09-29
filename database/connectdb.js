import mongoose from "mongoose";
import "dotenv/config";

try {
    await mongoose.connect(process.env.URI_MONGO);
    console.log('Conexion exitosa 👾👾')
} catch (error) {
    console.log('Error al conectar con la BD ' + error)
}