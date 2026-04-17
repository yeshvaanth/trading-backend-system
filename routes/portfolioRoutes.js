const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getPortfolio,getProfitLoss } = require("../controllers/portfolioController");

router.get("/", authMiddleware, getPortfolio);
router.get("/pnl", authMiddleware, getProfitLoss);

module.exports = router;