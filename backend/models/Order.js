const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  id: { type: Number, required: false },
  name: { type: String, required: false },
  price: { type: Number, required: false },
  quantity: { type: Number, required: false },
  image: { type: String, required: false },
  size: { type: String, required: false },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: false,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    orderItems: [orderItemSchema],
    items: [orderItemSchema],
    shippingAddress: {
      address: { type: String, required: false },
      city: { type: String, required: false },
      postalCode: { type: String, required: false },
      country: { type: String, required: false },
    },
    shippingDetails: {
      name: { type: String, required: false },
      address: { type: String, required: false },
      city: { type: String, required: false },
      postalCode: { type: String, required: false },
      email: { type: String, required: false },
    },
    totalPrice: {
      type: Number,
      required: false,
      default: 0.0,
    },
    total: {
      type: Number,
      required: false,
      default: 0.0,
    },
    status: {
      type: String,
      required: false,
      default: "Processing",
    },
    date: {
      type: Date,
      required: false,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
