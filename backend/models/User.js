const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const emailRegex = /^\S+@\S+\.\S+$/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [emailRegex, "Please provide a valid email address"],
  },
  password: {
    type: String,
    required: false,
    minlength: 6,
    select: false,
  },
  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
  phone: {
    type: String,
    trim: true,
    default: "",
  },
  address: {
    type: String,
    trim: true,
    default: "",
  },
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving if modified
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// Instance method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
