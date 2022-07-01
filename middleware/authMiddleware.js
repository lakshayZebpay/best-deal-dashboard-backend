const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.headers["token"];

  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        res.send({ msg: "pls login Again" });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

module.exports = { requireAuth };
