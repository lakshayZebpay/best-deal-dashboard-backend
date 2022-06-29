const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

//ROUTES

//CREATE A TEST
app.post("/test", async (req, res) => {
  try {
    console.log(req.body);
  } catch (err) {
    console.log(err.message);
  }
  res.send("12");
});
//get all

//get a

//update

//delete

app.listen(5500, () => {
  console.log("server has started on port 5500");
});
