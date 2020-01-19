require("dotenv").config();
const { User } = require("../model/user");
const mongoose = require("mongoose");
const path = require("path");
var debug = require("debug")("towerServer:server");
var express = require("express");
var router = express.Router();

async function createUser(id, pw, isAdmin) {
  //make user object
  const user = new User({
    ID: id,
    PW: pw,
    isAdmin: isAdmin
  });

  const result = await user.save();
  debug(result._id);
}

async function getUsers(id) {
  const users = await User.find({
    ID: id
  });
  debug(users);
}

async function removeUser(id) {
  const result = await User.deleteOne({ ID: id });
  debug(result);
}

router.post("/signIn", async function(req, res) {
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

router.post("/signUp", async function(req, res) {
  let id = req.body.id;
  let pw = req.body.pw;
  debug(id);
  debug(pw);

  const user = new User({
    ID: id,
    PW: pw,
    isAdmin: false,
    isAuthorized: false
  });

  const result = await user.save();
  res.send(result._id);
});

module.exports = router;
