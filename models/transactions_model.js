const mongoose = require("mongoose");

const Transaction = new mongoose.Schema(
  {
    exchangeName: { type: String, required: true },
    token: { type: String, required: true },
    currency: { type: String, required: true },
    tokenQuantity: { type: String, required: true },
    dateTime: { type: Date, required: true },
    cost: { type: String, required: true },
    userId: { type: String, required: true },
    oneTokenCost: { type: String, required: true },
    progress: { type: String, required: true },
  },
  {
    collection: "transactions-data",
  }
);

const model = mongoose.model("TransactionsData", Transaction);

module.exports = model;
