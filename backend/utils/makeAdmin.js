const mongoose = require("mongoose");
const User = require("../models/User");

async function makeAdmin() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI environment variable is not defined");
    }

    await mongoose.connect(uri);

    const user = await User.findOne({ email: "alex@example.com" });
    if (!user) {
      console.log("User with email alex@example.com not found");
      return;
    }

    user.role = "admin";
    await user.save();

    console.log("Success: alex@example.com has been updated to admin");
  } catch (err) {
    console.error("Error making user admin:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

makeAdmin();
