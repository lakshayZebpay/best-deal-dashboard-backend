const cron = require("node-cron");
const unirest = require("unirest");
const axios = require("axios");

module.exports = async function verifyTransaction(url, body) {
  const updatedUrl = `http://localhost:1337${url}/${body.coinName}`;

  let res = await unirest.get(updatedUrl);
  let data = res.body;

  const exchange = data.filter((oneExchange) => {
    return oneExchange.name.localeCompare(body.exchangeName) === 0;
  });
  const paid = Number(body.cost);
  const cryptoEarned = Number(body.coinAmount);

  const cryptoPrice = Number(exchange[0].price);
  const priceForTokenQuantity = cryptoEarned * cryptoPrice;

  const priceDifference = paid - priceForTokenQuantity;

  const precentageDiff = (priceDifference * 100) / paid;

  if (precentageDiff < 2 && precentageDiff > -1) {
    return { verified: true, oneTokenCost: cryptoPrice };
  } else {
    return { verified: false, oneTokenCost: cryptoPrice };
  }
};
