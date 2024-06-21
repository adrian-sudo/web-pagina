import expressAsyncHandler from "express-async-handler";
import * as productController from "../controllers/productController.js";

export const getAllProducts = expressAsyncHandler(async (req, res) => {
  await productController.getAllProducts(req, res);
});

export const getAllProductsAdmin = expressAsyncHandler(async (req, res) => {
  await productController.getAllProductsAdmin(req, res);
});

export const createProduct = expressAsyncHandler(async (req, res) => {
  await productController.createProduct(req, res);
});

export const updateProduct = expressAsyncHandler(async (req, res) => {
  await productController.updateProduct(req, res);
});

export const deleteProduct = expressAsyncHandler(async (req, res) => {
  await productController.deleteProduct(req, res);
});

export const createProductReview = expressAsyncHandler(async (req, res) => {
  await productController.createProductReview(req, res);
});

export const getProductSearch = expressAsyncHandler(async (req, res) => {
  await productController.getProductSearch(req, res);
});

export const getProductsByCategory = expressAsyncHandler(async (req, res) => {
  await productController.getProductsByCategory(req, res);
});

export const getProductBySlug = expressAsyncHandler(async (req, res) => {
  await productController.getProductBySlug(req, res);
});

export const getProductById = expressAsyncHandler(async (req, res) => {
  await productController.getProductById(req, res);
});

export const getCategories = expressAsyncHandler(async (req, res) => {
  await productController.getCategories(req, res);
});
