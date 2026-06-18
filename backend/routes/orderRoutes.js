const express = require("express");
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getUserOrders,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createRazorpayOrder);
router.post("/razorpay", protect, createRazorpayOrder);
router.post("/verify", protect, verifyRazorpayPayment);
router.get("/user", protect, getUserOrders);
router.get("/my-orders", protect, getUserOrders);
router.get("/myorders", protect, getUserOrders);

module.exports = router;
