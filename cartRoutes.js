import express from "express";
import Cart from "../models/Cart.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ======================
   GET USER CART
====================== */
router.get("/", protect, async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) {
    cart = await Cart.create({ userId: req.user.id, items: [] });
  }

  res.json(cart);
});

/* ======================
   ADD TO CART
====================== */
router.post("/", protect, async (req, res) => {
  const { productId, name, price, quantity } = req.body;

  let cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) {
    cart = await Cart.create({ userId: req.user.id, items: [] });
  }

  const index = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (index > -1) {
    cart.items[index].quantity += quantity;
  } else {
    cart.items.push({ productId, name, price, quantity });
  }

  await cart.save();
  res.json(cart);
});

/* ======================
   REMOVE ITEM
====================== */
router.delete("/:productId", protect, async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== req.params.productId
  );

  await cart.save();
  res.json(cart);
});

/* ======================
   CLEAR CART
====================== */
router.delete("/", protect, async (req, res) => {
  await Cart.findOneAndDelete({ userId: req.user.id });
  res.json({ message: "Cart cleared" });
});

export default router;
