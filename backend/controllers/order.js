import eah from "express-async-handler";

import Order from "../models/order.js";

// @desc   Create new Order
// @route  POST /api/orders
// @access Public
export const addOrderItems = eah(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
    return;
  }

  console.log(shippingAddress);
  const order = new Order({
    orderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc   Get order by ID
// @route  POST /api/orders/:id
// @access Private
export const getOrderById = eah(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  res.json(order);
});

// @desc   Update order to paid
// @route  Get /api/orders/:id/pay
// @access Private
export const updateOrderToPaid = eah(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer.email_address,
  };

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc   Get logged in user orders
// @route  Get /api/orders/myorders
// @access Private
export const getLoggedInUserOrders = eah(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc   Get all orders
// @route  Get /api/orders/myorders
// @access Private/Admin
export const getOrders = eah(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

// @desc   Update order to delivered
// @route  Get /api/orders/:id/deliver
// @access Private/Admin
export const updateOrderToDelivered = eah(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});
