import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        name: String,
        price: Number,
        quantity: {
          type: Number,
          default: 1
        }
      }
    ],

    // ✅ TOTAL (backward compatible)
    total: {
      type: Number,
      required: true
    },

    // ✅ NEW FIELDS (THIS WAS MISSING)
    address: {
      type: String
    },

    phone: {
      type: String
    },
 /* ✅ REQUIRED FOR CANCEL FEATURE */
    status: {
      type: String,
      enum: ["Pending", "Placed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
