const Product = require("../models/Product");

// Fetch all products
async function getProducts(req, res) {
  try {
    const products = await Product.find({});
    return res.json(products);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// Fetch single product by id
async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.json(product);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// Create product (admin only)
async function createProduct(req, res) {
  try {
    // Ensure admin
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized as an admin" });
    }

    const {
      name,
      description,
      price,
      imageUrl,
      image,
      category,
      type,
      stock,
      quantityInStock,
    } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      imageUrl: imageUrl || image,
      category,
      type,
      stock: stock ?? quantityInStock,
      quantityInStock,
    });

    return res.status(201).json({ success: true, product });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getProducts, getProductById, createProduct };
