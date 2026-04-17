const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["BUY", "SELL", "DEPOSIT", "WITHDRAWAL"],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  stock: {
    type: String,
    default: null
  },
  quantity: {
    type: Number,
    default: null
  },
  price: {
    type: Number,
    default: null
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    default: null
  },
  status: {
    type: String,
    enum: ["PENDING", "COMPLETED", "FAILED"],
    default: "COMPLETED"
  },
  description: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
