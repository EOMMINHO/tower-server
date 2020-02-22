require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../model/user");
const mongoose = require("mongoose");
var debug = require("debug")("towerServer:server");
var express = require("express");
var router = express.Router();
const Joi = require("@hapi/joi");

/*
 * sign in API
 *
 * Body: id and pw
 */
// schema
const signSchema = Joi.object({
  id: Joi.string()
    .min(3)
    .max(30),
  pw: Joi.string()
    .min(3)
    .max(30)
});

router.post("/signIn", async function(req, res) {
  let id = req.body.id;
  let pw = req.body.pw;

  // data type checking
  const { error, value } = signSchema.validate({
    id: id,
    pw: pw
  });
  if (error !== undefined) {
    res.status(400).send(error.details[0].message);
  }

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
  //res.header("x-auth-token", token).send(token);
  res.send(token);
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

  // data type checking
  const { error, value } = signSchema.validate({
    id: id,
    pw: pw
  });
  if (error !== undefined) {
    res.status(400).send(error.details[0].message);
  }

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
