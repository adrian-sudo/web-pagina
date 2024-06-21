//Manejamos las solicitudes POST lara subir archivos a Cloudinary
//Hacemoa las importaciones necesarias
import express from "express";
import multer from "multer"; //Es un middleware de Node.js que se utiliza para manejar la subida de archivos en las solicitudes HTTP.
import { v2 as cloudinary } from "cloudinary"; //servicio en línea que se utiliza para almacenar y administrar archivos multimedia en la nube, v2 se utiliza para importar la versión 2 de la API de Cloudinary.
import streamifier from "streamifier"; //Es un módulo de Node.js que se utiliza para crear streams a partir de buffers.
import { isAdmin, isAuth } from "../utils.js";

//Dedinimos a "upload" que es un middleware de multer que se utiliza para manejar la subida de archivos
const upload = multer();
//Definimos el enrutador de "uploadRouter"
const uploadRouter = express.Router();

//Definimos la ruta con el metodo POST para agregar una nueva imagen
uploadRouter.post(
  "/",
  isAuth, //Lo utilizamos para verificar si el usuario esta autenticado
  isAdmin, //Lo utilizamos para verificar si el usuario es administrador
  upload.single("file"), //Esto nos indica que se espera un solo archivo en la solicitud HTTP
  async (req, res) => {
    //Configuramos a Cloudinary con nuestras variables de entorno
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME, //Nombre de la nube
      api_key: process.env.CLOUDINARY_API_KEY, //ApiKey
      api_secret: process.env.CLOUDINARY_API_SECRET, //ApiSecret
    });
    //Definimos la función "streamUpload" para subir el archivo a Cloudinary
    const streamUpload = (req) => {
      //Retornamos una nueva promesa que resuelve "resolve" con el resultado de la subida o rechaza "reject" en caso de un error
      return new Promise((resolve, reject) => {
        //Creamos un "stream" con la función "cloudinary.uploader.upload_stream"
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            //Si la subida se realiza correctamente, se resulve la promesa con el resultado de la subida
            resolve(result);
          } else {
            //Si se produce un error, se rechaza la promesa
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    //Utilizamos esta función para subir el archivo en la solicitud HTTP utilizando "await"
    const result = await streamUpload(req); //Almacenamos el resultado en la constante "result"
    res.send(result); //Se envía una respuesta HTTP con el resultado de la subida en formato JSON utilizando "res.send(result)"
  }
);
//Exportamos
export default uploadRouter;
