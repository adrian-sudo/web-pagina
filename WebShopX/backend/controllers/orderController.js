import Order from "../models/orderModel.js";

export const getAllOrders = async () => {
  try {
    return await Order.find().populate("user", "name");
  } catch (error) {
    throw new Error("Error al obtener las órdenes.");
  }
};

export const createOrder = async (orderData, userId) => {
  try {
    const newOrder = new Order({
      ...orderData,
      user: userId,
    });
    return await newOrder.save();
  } catch (error) {
    throw new Error("Error al crear la orden.");
  }
};

export const getOrderSummary = async (req, res) => {
  try {
    const data = await getOrderSummary();
    res.send(data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getUserOrders = async (userId) => {
  try {
    return await Order.find({ user: userId });
  } catch (error) {
    throw new Error("Error al obtener las órdenes del usuario.");
  }
};

export const getOrderById = async (orderId) => {
  try {
    return await Order.findById(orderId);
  } catch (error) {
    throw new Error("Error al obtener la orden por ID.");
  }
};
