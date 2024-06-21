//Definimos el modelo de usuario
import mongoose from "mongoose"; //Importamos Mongoose

//Definimos el esquema "userSchema" utilizandola función "mongoose.Schema"
const userSchema = mongoose.Schema(
  {
    //Definimos la estructura de usuarios en MongoDB
    name: { type: String, required: true }, //Nombre
    email: { type: String, required: true, unique: true }, //Email
    password: { type: String, required: true }, //Contraseña
    isAdmin: { type: Boolean, default: false, required: true }, //Rol
  },
  {
    timestamps: true, //Este objeto agrega automaticamente la fecha de creación "createdAt" y la de actualización "updateAt"
  }
);
//Utilizamos "mongoose.model" para crear el modelo "User" en la base de datos
const User = mongoose.model("User", userSchema);
//Exportamos
export default User;
