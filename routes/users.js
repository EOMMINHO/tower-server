require("dotenv").config();
const path = require("path");
var debug = require("debug")("towerServer:server");
var express = require("express");
var router = express.Router();

/* GET users listing. */
router.post("/signIn", function(req, res) {
  let id = req.body.id;
  let pw = req.body.pw;
  debug(id);
  debug(pw);

  //authentication test (DO NOT USE FOR PRODUCTION!!!!!!!!!)
  if (id === process.env.ADMIN_ID && pw === process.env.ADMIN_PW) {
    res
      .status(200)
      .sendFile(path.join(__dirname + "/../public/html/setting.html"));
  } else {
    res.status(401).send("authentication wrong!");
  }
});

module.exports = router;
