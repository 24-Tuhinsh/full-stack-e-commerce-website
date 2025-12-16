import express from "express";
import mongoose from "mongoose"; // ✅ Mongoose import
import Order from "../models/Order.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ===================== PLACE ORDER =====================
router.post("/", protect, async (req, res) => {
  try {
    const { items, total, totalPrice, address, phone } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const order = await Order.create({
      userId: req.user._id,
      items,
      total: totalPrice || total,
      address,
      phone
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to place order" });
  }
});

// ===================== GET USER ORDERS =====================
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// ===================== CANCEL ORDER =====================
router.patch("/:id/cancel", protect, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id); // ✅ Use new
    const orderId = req.params.id;

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, userId },
      { status: "Cancelled" },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found or not yours" });
    }

    res.json({ message: "Order cancelled successfully", order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
});

export default router;
