import express from "express";
import connectDB from "./db/connection.js";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";

connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/upload", uploadRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

// Middleware for centralized error handling
app.use((err, req, res, next) => {
  console.error("Error en la solicitud:", err.message);
  res.status(500).json({ message: "Error en el servidor." });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`El servidor está corriendo en http://localhost:${port}`);
});
