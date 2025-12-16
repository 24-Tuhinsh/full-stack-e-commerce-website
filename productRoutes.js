import express from "express";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminProtect.js";

const router = express.Router();

// GET ALL PRODUCTS (PUBLIC)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

//  GET SINGLE PRODUCT (details page)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "Invalid product ID" });
  }
});

// ADD PRODUCT (ADMIN)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch {
    res.status(500).json({ message: "Failed to add product" });
  }
});

// UPDATE PRODUCT (ADMIN)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch {
    res.status(500).json({ message: "Failed to update product" });
  }
});

// DELETE PRODUCT (ADMIN)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch {
    res.status(500).json({ message: "Failed to delete product" });
  }
});

export default router;
