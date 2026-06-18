const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order = require("../models/Order");
const Product = require("../models/Product");

function getRazorpayClient() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials are not configured");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

function normalizeOrderProducts(products = []) {
  return products
    .map((item) => {
      const productId = item.productId || item.id || item._id;
      if (!productId) {
        return null;
      }

      return {
        productId,
        name: item.name || "Product",
        image: item.image || item.imageUrl || "",
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        size: item.size || "",
      };
    })
    .filter(Boolean);
}

async function createRazorpayOrder(req, res) {
  try {
    const { products = [], totalAmount } = req.body;
    const normalizedProducts = normalizeOrderProducts(products);

    if (!normalizedProducts.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const amountValue = Number(totalAmount);
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    const razorpay = getRazorpayClient();
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amountValue * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1,
    });

    const order = await Order.create({
      userId: req.user._id,
      products: normalizedProducts,
      totalAmount: amountValue,
      razorpayOrderId: razorpayOrder.id,
      status: "PROCESSING",
    });

    return res.status(201).json({
      success: true,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      order,
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create Razorpay order",
    });
  }
}

async function verifyRazorpayPayment(req, res) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification fields",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const inventoryUpdates = [];
    for (const item of order.products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        continue;
      }

      const existingStock =
        typeof product.quantityInStock === "number" && product.quantityInStock > 0
          ? product.quantityInStock
          : product.stock || 0;
      const nextStock = existingStock - Number(item.quantity || 1);

      if (nextStock < 0) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      inventoryUpdates.push({ product, nextStock });
    }

    for (const entry of inventoryUpdates) {
      entry.product.quantityInStock = entry.nextStock;
      entry.product.stock = entry.nextStock;
      await entry.product.save();
    }

    order.razorpayPaymentId = razorpay_payment_id;
    order.status = "COMPLETED";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    console.error("Payment verification failed:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed",
    });
  }
}

async function getUserOrders(req, res) {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user orders",
    });
  }
}

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getUserOrders,
};
