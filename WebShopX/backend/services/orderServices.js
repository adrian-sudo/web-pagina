import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name");
    res.send(orders);
  } catch (error) {
    res.status(500).send({ message: "Error al obtener las órdenes." });
  }
};

export const createOrder = async (req, res) => {
  try {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });
    const order = await newOrder.save();
    res.status(201).send({ message: "¡Nueva orden creada!", order });
  } catch (error) {
    res.status(500).send({ message: "Error al crear la orden." });
  }
};

export const getOrderSummary = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);

    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
  } catch (error) {
    res.status(500).send({ message: "Error al obtener el resumen." });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error al obtener las órdenes del usuario." });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "¡Orden no encontrada!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error al obtener la orden por ID." });
  }
};
