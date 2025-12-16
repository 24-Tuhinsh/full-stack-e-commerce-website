import express from "express";
import Product from "../models/Product.js";
import adminProtect from "../middleware/adminProtect.js";

const router = express.Router();

// GET ALL PRODUCTS
router.get("/products", adminProtect, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ADD PRODUCT
router.post("/products", adminProtect, async (req, res) => {
  const { name, price, image, description } = req.body;

  try {
    const product = await Product.create({
      name,
      price,
      image,
      description: description || "No description provided" // ✅ add default
    });
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add product" });
  }
});

// UPDATE PRODUCT
router.put("/products/:id", adminProtect, async (req, res) => {
  try {
    const { name, price, image, description } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, image, description },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product" });
  }
});

// DELETE PRODUCT
router.delete("/products/:id", adminProtect, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

export default router;
