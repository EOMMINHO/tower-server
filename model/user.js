const mongoose = require("mongoose");

//make user schema
const userSchema = new mongoose.Schema({
  ID: String,
  PW: String,
  date: { type: Date, default: Date.now },
  isAdmin: Boolean,
  isAuthorized: Boolean
});

//make user model
const User = mongoose.model("User", userSchema);

module.exports.User = User;
