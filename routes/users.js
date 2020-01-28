require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../model/user");
const mongoose = require("mongoose");
var debug = require("debug")("towerServer:server");
var express = require("express");
var router = express.Router();

/*
 * sign in API
 *
 * Body: id and pw
 */
router.post("/signIn", async function(req, res) {
  let id = req.body.id;
  let pw = req.body.pw;
  debug(id);
  debug(pw);

  //find and authenticate user
  let user = await User.findOne({ ID: id });
  if (!user) return res.status(400).send("No ID Found.");

  const validPW = await bcrypt.compare(pw, user.PW);
  if (!validPW) return res.status(400).send("Wrong password.");

  //send JWT if authenticated
  const token = jwt.sign(
    { isAuthorized: user.isAuthorized, isAdmin: user.isAdmin },
    process.env.JWT_PRIVATE_KEY
  );
  res.header("x-auth-token", token).send(token);
});

/*
 * sign up API
 *
 * Body: id and pw
 * IF id duplicated, reject
 */
router.post("/signUp", async function(req, res) {
  let id = req.body.id;
  let pw = req.body.pw;
  debug(id);
  debug(pw);

  //check duplicate ID
  let user = await User.findOne({ ID: id });
  if (user) return res.status(400).send("ID already registered.");

  //hashing
  const salt = await bcrypt.genSalt(10);
  pw = await bcrypt.hash(pw, salt);

  //register new user
  user = new User({
    ID: id,
    PW: pw,
    isAdmin: false,
    isAuthorized: false
  });

  await user.save();

  //return JWT and _id
  const token = jwt.sign(
    { isAuthorized: user.isAuthorized, isAdmin: user.isAdmin },
    process.env.JWT_PRIVATE_KEY
  );
  res.header("x-auth-token", token).send(_.pick(user, ["_id"]));
});

//exports
module.exports = router;
