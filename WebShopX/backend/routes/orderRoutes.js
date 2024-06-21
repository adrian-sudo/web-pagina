import express from "express";
import expressAsyncHandler from "express-async-handler";
import * as orderServices from "../services/orderServices.js";
import { isAuth, isAdmin } from "../utils.js";

const orderRoutes = express.Router();

orderRoutes.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(orderServices.getAllOrders)
);

orderRoutes.post(
  "/",
  isAuth,
  expressAsyncHandler(orderServices.createOrder)
);

orderRoutes.get(
  "/summary",
  isAuth,
  isAdmin,
  expressAsyncHandler(orderServices.getOrderSummary)
);

orderRoutes.get(
  "/mine",
  isAuth,
  expressAsyncHandler(orderServices.getUserOrders)
);

orderRoutes.get(
  "/:id",
  isAuth,
  expressAsyncHandler(orderServices.getOrderById)
);

export default orderRoutes;

