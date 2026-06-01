const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Helper to sign JWT
function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

// Register a new user
async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    const token = signToken(user._id);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return res.status(201).json({ success: true, token, user: userResponse });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// Login existing user
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = signToken(user._id);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return res.status(200).json({ success: true, token, user: userResponse });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { registerUser, loginUser };
