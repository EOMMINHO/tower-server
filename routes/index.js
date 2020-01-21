require("dotenv").config();
const jwt = require("jsonwebtoken");
const path = require("path");
var debug = require("debug")("towerServer:server");
var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token)
    return res.sendFile(path.join(__dirname + "/../public/html/signIn.html"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    debug(decoded);
    if (decoded.isAuthorized === true)
      res.sendFile(path.join(__dirname + "/../public/html/setting.html"));
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
});

module.exports = router;
