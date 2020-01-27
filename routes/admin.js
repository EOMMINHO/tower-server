require("dotenv").config();
const Joi = require("@hapi/joi");
const { authAdmin } = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../model/user");
const mongoose = require("mongoose");
var debug = require("debug")("towerServer:server");
var express = require("express");
var router = express.Router();

//find ID and change authorization
router.post("/findUserInfo", authAdmin, async function(req, res) {
  let id = req.body.id;

  //find and authenticate user
  let user = await User.findOne({ ID: id });
  if (!user) return res.status(400).send("no such user.");

  return res.send(user);
});

//find ID and change authorization
router.post("/changeAuth", authAdmin, async function(req, res) {
  let id = req.body.id;
  let isAuthorized = req.body.isAuthorized;

  //find and authenticate user
  let user = await User.findOne({ ID: id });
  if (!user) return res.status(400).send("no such user.");

  //change user authorization
  user.isAuthorized = isAuthorized ? true : false;
  await user.save();

  return res.send(user);
});

module.exports = router;
