const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// const { requireAuth } = require("./middleware/authMiddleware");
const jwt = require("jsonwebtoken");
const User = require("./models/user_model");

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://GSM1023-zebpay:GSM1023-zebpay@cluster0.anp6t.mongodb.net/best-deal?retryWrites=true&w=majority"
);
let refreshTokens = [];
app.post("/api/token", (req, res) => {
  const refreshToken = req.body.token;

  if (refreshTokens === null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) res.sendStatus(403);

    const accessToken = genetrateAccessToken(user);
    res.json({ accessToken });
  });
});
app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    $or: [{ number: req.body.username }, { email: req.body.username }],
  });
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      let accessToken = genetrateAccessToken(user);
      const sendData = {
        id: user.id,
        name: user.name,
        email: user.email,
        number: user.number,
      };
      let refreshToken = generateRefereshToken(user);
      return res.json({
        status: "ok",
        user: true,
        accessToken,
        refreshToken,
        userData: sendData,
      });
    } else {
      return res.json({ status: "error", user: false });
    }
  } catch {
    res.status(500).send();
  }
});

app.delete("/api/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});
function genetrateAccessToken(user) {
  return jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "24h",
  });
}
function generateRefereshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}
app.listen(4000, function () {
  console.log("request started on port 4000");
});
