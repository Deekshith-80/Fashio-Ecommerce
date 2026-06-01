const express = require("express");
const {
  createOrder,
  addOrderItems,
  getMyOrders,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);
router.post("/legacy", protect, addOrderItems);
router.get("/my-orders", protect, getMyOrders);
router.get("/myorders", protect, getMyOrders);

module.exports = router;
