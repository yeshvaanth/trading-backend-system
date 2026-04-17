const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  stock: {
    type: String
  },
  type: {
    type: String, 
  },
  quantity: Number,
  price: Number
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);