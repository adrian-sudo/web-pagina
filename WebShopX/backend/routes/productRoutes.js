import express from "express";
import Product from "../models/productModel.js";
import expressAsyncHandler from "express-async-handler";
import * as productServices from "../services/productServices.js";
import { isAuth, isAdmin } from "../utils.js";

const productRoutes = express.Router();

productRoutes.get("/", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

productRoutes.get(
  "/admin",
  isAuth,
  isAdmin,
  expressAsyncHandler(productServices.getAllProductsAdmin)
);

productRoutes.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(productServices.createProduct)
);

productRoutes.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(productServices.updateProduct)
);

productRoutes.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(productServices.deleteProduct)
);

productRoutes.post(
  "/:id/reviews",
  isAuth,
  expressAsyncHandler(productServices.createProductReview)
);

productRoutes.get(
  "/search",
  expressAsyncHandler(productServices.getProductSearch)
);

productRoutes.get(
  "/categories",
  expressAsyncHandler(productServices.getCategories)
);

productRoutes.get(
  "/slug/:slug",
  expressAsyncHandler(productServices.getProductBySlug)
);

productRoutes.get(
  "/:id",
  expressAsyncHandler(productServices.getProductById)
);

productRoutes.get(
  "/category",
  expressAsyncHandler(productServices.getProductsByCategory)
);

export default productRoutes;
