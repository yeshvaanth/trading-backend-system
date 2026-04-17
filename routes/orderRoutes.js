const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { buyStock,sellStock,getOrderHistory } = require("../controllers/orderController");

router.post("/buy", authMiddleware, buyStock);
router.post("/sell", authMiddleware, sellStock);
router.get("/history", authMiddleware, getOrderHistory);

module.exports = router;