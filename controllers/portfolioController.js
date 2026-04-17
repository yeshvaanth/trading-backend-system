const Portfolio = require("../models/Portfolio");
const Stock = require("../models/Stock");

exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ user: req.user });

    res.json(portfolio);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getProfitLoss = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ user: req.user });

    let result = [];

    for (let item of portfolios) {
      const stock = await Stock.findOne({ symbol: item.stock });

      if (!stock) continue;

      const currentValue = stock.price * item.quantity;
      const investedValue = item.avgPrice * item.quantity;

      const profitLoss = currentValue - investedValue;

      result.push({
        stock: item.stock,
        quantity: item.quantity,
        avgPrice: item.avgPrice,
        currentPrice: stock.price,
        profitLoss
      });
    }

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};