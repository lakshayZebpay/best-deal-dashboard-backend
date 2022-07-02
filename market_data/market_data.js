const cron = require("node-cron");
const unirest = require("unirest");
const axios = require("axios");

croncallFTX("BTC/USDT");
croncallFTX("ETH/USDT");
croncallFTX("XRP/USDT");
croncallFTX("BAT/USD");
croncallFTX("ADA-0930");

function croncallFTX(token) {
  cron.schedule("*/30 * * * * *", () => {
    //console.log(new Date());
    getFTXPrice(`https://ftx.com/api/markets/${token}`)
      .then(async (data) => {
        //console.log(`FTX-${token} : ` + data);
        const tok = token.slice(0, 3);
        const res = await axios.patch(
          `http://localhost:1337/api/marketValue/${tok}/FTX`,
          { price: data }
        );
      })
      .catch((e) => {
        console.log("error");
      });
  });
}

async function getFTXPrice(url) {
  let res = await unirest.get(url);
  let data = res.body;
  return data.result.price;
}

croncallCOINBASE("BTC");
croncallCOINBASE("ETH");
croncallCOINBASE("XRP");
croncallCOINBASE("BAT");
croncallCOINBASE("ADA");

function croncallCOINBASE(token) {
  cron.schedule("*/30 * * * * *", () => {
    //console.log(new Date());
    getCOINBASEPrice(
      `https://api.coinbase.com/v2/exchange-rates?currency=${token}`
    )
      .then(async (data) => {
        //console.log(`COINBASE-${token} : ` + data);
        const tok = token;
        const res = await axios.patch(
          `http://localhost:1337/api/marketValue/${tok}/COINBASE`,
          { price: data }
        );
      })
      .catch((e) => {
        console.log("error");
      });
  });
}

async function getCOINBASEPrice(url) {
  let res = await unirest.get(url);
  let data = res.body;
  return data.data.rates.USDT;
}

croncallBINANCE();

function croncallBINANCE() {
  cron.schedule("*/30 * * * * *", () => {
    //console.log(new Date());
    getBINANCEPrice(
      `https://api.binance.com/api/v3/ticker?symbols=["BTCUSDT","ETHUSDT","XRPUSDT","ADAUSDT","BATUSDT"]&windowSize=1m`
    )
      .then(async (data) => {
        data.forEach(async (value) => {
          const tok = value.symbol.slice(0, 3);
          const price_value = value.weightedAvgPrice;
          await axios.patch(
            `http://localhost:1337/api/marketValue/${tok}/BINANCE`,
            { price: price_value }
          );
          //console.log(`BINANCE-${tok} : ` + price_value);
        });
      })
      .catch((e) => {
        console.log("error");
      });
  });
}

async function getBINANCEPrice(url) {
  let res = await unirest.get(url);
  let data = res.body;
  return data;
}

croncallKRAKEN();

function croncallKRAKEN() {
  cron.schedule("*/30 * * * * *", () => {
    //console.log(new Date());
    getKRAKENPrice(
      `https://api.kraken.com/0/public/Ticker?pair=XBTUSD,BATUSD,ETHUSD,XRPUSD,ADAUSD`
    )
      .then(async (data) => {
        Object.keys(data).forEach(async (key) => {
          let tok = key.slice(0, 3);
          if (tok === "XET") {
            tok = "ETH";
          } else if (tok === "XXB") {
            tok = "BTC";
          } else if (tok === "XXR") {
            tok = "XRP";
          }
          const price_value = data[key].p[0];
          await axios.patch(
            `http://localhost:1337/api/marketValue/${tok}/KRAKEN`,
            { price: price_value }
          );
          //console.log(`KRAKEN-${tok} : ` + price_value);
        });
      })
      .catch((e) => {
        console.log("error");
      });
  });
}

async function getKRAKENPrice(url) {
  let res = await unirest.get(url);
  let data = res.body;
  return data.result;
}

croncallGEMINI("BTCUSD");
croncallGEMINI("ETHUSD");
croncallGEMINI("BATUSD");
// croncallKRAKEN("XRPUSD");
// croncallKRAKEN("ADAUSD");

function croncallGEMINI(token) {
  cron.schedule("*/30 * * * * *", () => {
    //console.log(new Date());
    getGEMINIPrice(
      `https://api.gemini.com/v1/pubticker/${token.toLowerCase()}`
    ).then(async (data) => {
      const tok = token.slice(0, 3);
      await axios.patch(`http://localhost:1337/api/marketValue/${tok}/GEMINI`, {
        price: data,
      });
      //console.log(`GEMINI-${tok} : ` + data);
    });
  });
}

async function getGEMINIPrice(url) {
  let res = await unirest.get(url);
  let data = res.body;
  return data.volume.USD;
}
