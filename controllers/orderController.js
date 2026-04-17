const User = require("../models/User");
const Stock = require("../models/Stock");
const Order = require("../models/Order");

const Portfolio = require("../models/Portfolio");

exports.buyStock = async (req,res)=>{
    
  try{

    const { symbol, quantity } = req.body;
    const user = await User.findById(req.user);
    const stock = await Stock.findOne({ symbol });

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    const totalPrice = stock.price * quantity;

    if (user.balance < totalPrice) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.balance -= totalPrice;
    await user.save();

    const order = await Order.create({
      user: user._id,
      stock: symbol,
      type: "BUY",
      quantity,
      price: stock.price
    });


     let portfolio = await Portfolio.findOne({user: user._id,stock: stock.symbol});

    if (portfolio) {

      const totalQty = portfolio.quantity + quantity;

      portfolio.avgPrice =((portfolio.quantity * portfolio.avgPrice) + (quantity * stock.price)) / totalQty;

      portfolio.quantity = totalQty;

      await portfolio.save();

    } else {

      await Portfolio.create({
        user: user._id,
        stock: stock.symbol,
        quantity,
        avgPrice: stock.price
      });
    }

    res.json({message: "Stock bought successfully",order});

    }catch (error){
        res.status(500).json({ error: error.message });
    }

}


exports.sellStock = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;

    const user = await User.findById(req.user);
    const stock = await Stock.findOne({ symbol });

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    let portfolio = await Portfolio.findOne({user: user._id,stock: symbol});

    if (!portfolio) {
      return res.status(400).json({ message: "No stock to sell" });
    }

    if (portfolio.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }


    const totalPrice = stock.price * quantity;

    user.balance += totalPrice;
    await user.save();

    portfolio.quantity -= quantity;

    if (portfolio.quantity === 0) {
      await Portfolio.deleteOne({ _id: portfolio._id });
    } else {
      await portfolio.save();
    }

    const order = await Order.create({
      user: user._id,
      stock: symbol,
      type: "SELL",
      quantity,
      price: stock.price
    });

    res.json({message: "Stock sold successfully",order});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  
};

exports.getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user })
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

