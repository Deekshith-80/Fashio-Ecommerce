const Order = require("../models/Order");

async function createOrder(req, res) {
  try {
    const normalizedItems = Array.isArray(req.body.items)
      ? req.body.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity ?? item.qty ?? 1,
          image: item.image,
          size: item.size,
        }))
      : [];

    const newOrder = new Order({
      orderId: req.body.orderId,
      items: normalizedItems,
      total: req.body.total,
      shippingDetails: req.body.shippingDetails,
      status: req.body.status || "PROCESSING",
      date: req.body.date || new Date(),
      user: req.user?._id || undefined,
      orderItems: normalizedItems,
      shippingAddress: req.body.shippingAddress || {
        address: req.body.shippingDetails?.address || "",
        city: req.body.shippingDetails?.city || "",
        postalCode: req.body.shippingDetails?.postalCode || "",
        country: req.body.shippingDetails?.country || "India",
      },
      totalPrice: req.body.totalPrice || req.body.total || 0,
    });

    const savedOrder = await newOrder.save();
    return res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Backend DB Save Error:", error);
    return res
      .status(500)
      .json({ message: "Database insertion failed", error: error.message });
  }
}

async function addOrderItems(req, res) {
  try {
    const { orderItems, shippingAddress, totalPrice, status } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No order items" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalPrice,
      status: status || "Processing",
    });

    const createdOrder = await order.save();

    return res.status(201).json({ success: true, order: createdOrder });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { createOrder, addOrderItems, getMyOrders };
