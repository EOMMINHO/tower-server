require("dotenv").config();
const { authAdmin } = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../model/user");
const mongoose = require("mongoose");
var debug = require("debug")("towerServer:server");
var express = require("express");
var router = express.Router();
const Joi = require("@hapi/joi");

// find every user
router.post("/findEveryUser", authAdmin, async function(req, res) {
  let user = await User.find({});

  return res.send(user);
});

// find specific user
// schema
const findUserSchema = Joi.object({
  id: Joi.string()
    .min(3)
    .max(30)
});

router.post("/findUserInfo", authAdmin, async function(req, res) {
  let id = req.body.id;
  // data type checking
  const { error, value } = findUserSchema.validate({
    id: id
  });
  if (error !== undefined) {
    res.status(400).send(error.details[0].message);
  }

  //find and authenticate user
  let user = await User.findOne({ ID: id });
  if (!user) return res.status(400).send("no such user.");

  return res.send(user);
});

// find ID and change authorization
// schema
const changeAuthSchema = Joi.object({
  id: Joi.string()
    .min(3)
    .max(30),
  isAuthorized: Joi.boolean()
});

router.post("/changeAuth", authAdmin, async function(req, res) {
  let id = req.body.id;
  let isAuthorized = req.body.isAuthorized;
  // data type checking
  const { error, value } = changeAuthSchema.validate({
    id: id,
    isAuthorized: isAuthorized
  });
  if (error !== undefined) {
    res.status(400).send(error.details[0].message);
  }

  //find and authenticate user
  let user = await User.findOne({ ID: id });
  if (!user) return res.status(400).send("no such user.");

  //change user authorization
  user.isAuthorized = isAuthorized ? true : false;
  await user.save();

  return res.send(user);
});

router.post("/deleteUser", authAdmin, async function(req, res) {
  let id = req.body.id;
  // data type checking
  const { error, value } = findUserSchema.validate({
    id: id
  });
  if (error !== undefined) {
    res.status(400).send(error.details[0].message);
  }

  //find and authenticate user
  let user = await User.findOneAndDelete({ ID: id });
  if (!user) return res.status(400).send("no such user.");

  return res.send(user);
});

module.exports = router;
