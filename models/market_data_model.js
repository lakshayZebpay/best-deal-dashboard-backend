const mongoose = require("mongoose");
const MValue = new mongoose.Schema(
  {
    token: { type: String, required: true },
    currency: { type: String, required: true },
    exchangeName: { type: String, required: true },
    price: { type: Number, required: true },
  },
  {
    collection: "market-value-data",
  }
);
const model = mongoose.model("MValueData", MValue);
module.exports = model;
