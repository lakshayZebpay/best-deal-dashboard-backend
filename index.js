const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { requireAuth } = require("./middleware/authMiddleware");
const jwt = require("jsonwebtoken");
const User = require("./models/user_model");
const Transaction = require("./models/transactions_model");
const MValue = require("./models/market_data_model");
require("./market_data/market_data");

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://GSM1023-zebpay:GSM1023-zebpay@cluster0.anp6t.mongodb.net/best-deal?retryWrites=true&w=majority"
);
//mongoose.connect('mongodb://localhost:27017/Group_D_Tables')

app.get("/user", requireAuth, async (req, res) => {
  const user = await User.findOne({
    email: req.user.email,
  });

  const sendData = {
    id: user.id,
    name: user.name,
    email: user.email,
    number: user.number,
  };
  res.send({ userData: sendData });
});

app.post("/api/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      number: req.body.number,
      password: hashedPassword,
    });
    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "err", error: "Duplicate Email" });
  }
});
app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    $or: [{ number: req.body.username }, { email: req.body.username }],
  });
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      let token = jwt.sign(
        { email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "24h",
        }
      );
      const sendData = {
        id: user.id,
        name: user.name,
        email: user.email,
        number: user.number,
      };
      return res.json({ status: "ok", user: true, token, userData: sendData });
    } else {
      return res.json({ status: "error", user: false });
    }
  } catch {
    res.status(500).send();
  }
});

app.get("/transactions", requireAuth, async (req, res) => {
  const user = await User.findOne({
    email: req.user.email,
  });
  const transactionData = await Transaction.find({
    userId: user.id,
  });

  res.send({ transactionData });
});

app.post("/transactions", requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.user.email,
    });

    const transaction = await Transaction.create({
      exchangeName: req.body.exchangeName,
      token: req.body.coinName,
      currency: req.body.currency,
      tokenQuantity: req.body.coinAmount,
      dateTime: new Date(),
      cost: req.body.cost,
      userId: user.id,
      oneTokenCost: req.body.oneTokenCost,
      progress: req.body.progress,
    });

    res.json({ status: "Transaction Created" });
  } catch (err) {
    res.json({ status: "err", error: "Transaction Failed" });
  }
});

app.get("/api/marketValue/:token_name", async (req, res) => {
  try {
    const token = req.params.token_name;
    const token_data = await MValue.find({ token });
    const exchange_data = [];

    token_data.forEach((data) => {
      const object = {
        _id: data._id,
        name: data.exchangeName,
        price: data.price,
      };
      exchange_data.push(object);
    });

    //console.log(exchange_data);
    res.send(exchange_data);
  } catch (error) {
    res.send(error);
  }
});

app.post("/api/marketValue", async (req, res) => {
  //   console.log(req.body);
  try {
    const newMarketData = await MValue.create({
      token: req.body.token,
      currency: req.body.currency,
      exchangeName: req.body.exchangeName,
      price: req.body.price,
    });
    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "err", error: "Some error in posting" });
  }
});
app.patch("/api/marketValue/:token_name/:exchange_name", async (req, res) => {
  try {
    const filter = {
      token: req.params.token_name,
      exchangeName: req.params.exchange_name,
    };
    const update = { price: req.body.price };
    let doc = await MValue.findOneAndUpdate(filter, update);
    if (!doc) {
      throw new Error();
    }
    res.json({ status: "ok" });
  } catch (error) {
    res.json({
      status: "err",
      error:
        "Some error in updating , please check token name and exchange name",
    });
  }
});

app.listen(1337, function () {
  console.log("request started on port 1337");
});
