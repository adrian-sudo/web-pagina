import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("¡Conexión exitosa a la base de datos!");
  } catch (err) {
    console.log(err.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;