const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

dotenv.config();

async function createAdmin() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI environment variable is not defined");
    }

    await mongoose.connect(uri);

    let user = await User.findOne({ email: "admin@fashio.com" });
    if (user) {
      console.log("Admin user already exists:", user.email);
      return;
    }

    user = new User({
      name: "Admin User",
      email: "admin@fashio.com",
      password: "admin1234",
      role: "admin",
    });

    await user.save();

    console.log("Success: admin user created at admin@fashio.com");
  } catch (err) {
    console.error("Error creating admin user:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
