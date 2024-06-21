//Definimos el modelos de las reseñas y los productos
import mongoose from "mongoose"; //Importamos Mongoose

//Definimos el esquema "reviewSchema" para las reseñas utilizando la función "mongoose.Schema"
const reviewSchema = new mongoose.Schema(
  {
    //Definimos la estructura de las reseñas en MongoDB
    name: { type: String, required: true }, //Nombre
    comment: { type: String, required: true }, //Comentario
    rating: { type: Number, required: true }, //Calificación
  },
  {
    timestamps: true, //Este objeto agrega automaticamente la fecha de creación "createdAt" y la de actualización "updateAt"
  }
);

//Definimos el esquema "productSchema" para los productos utilizando la función "mongoose.Schema"
const productSchema = mongoose.Schema(
  {
    //Definimos la estructura de los productos
    name: { type: String, required: true, unique: true }, //Nombre
    slug: { type: String, required: true, unique: true }, //Link
    image: { type: String, required: true }, //Imagen
    brand: { type: String, required: true }, //Marca
    category: { type: String, required: true }, //Categoria
    description: { type: String, required: true }, //Descripción
    price: { type: Number, required: true }, //Precio
    countInStock: { type: Number, required: true }, //Stock
    rating: { type: Number, required: true }, //Calificaciones
    numReviews: { type: Number, required: true }, //Numero de calificaciones
    reviews: [reviewSchema], //Agregamos el esquema de las reseñas creado anteriormente
  },
  {
    timestamps: true, //Agregamos la fecha de creación y actualización
  }
);
//Utilizamos "mongoose.model" para crear el modelo "Product" en la base de datos
const Product = mongoose.model("Product", productSchema);
//Exportamos
export default Product;
