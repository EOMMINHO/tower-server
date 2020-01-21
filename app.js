require("dotenv").config();
const mongoose = require("mongoose");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var debug = require("debug")("towerServer:server");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
//var stepperRouter = require("./routes/api/stepper");
//var tempRouter = require("./routes/api/temperature");

var app = express();

//connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/tower")
  .then(() => debug("Connected to MongoDB."))
  .catch(err => debug("Could not connect to MongoDB.", err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static("public"));

app.use("/", indexRouter);
app.use("/users", usersRouter);
//app.use("/api/stepper", stepperRouter);
//app.use("/api/temperature", tempRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
