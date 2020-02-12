require("dotenv").config();
const mongoose = require("mongoose");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var debug = require("debug")("towerServer:server");

// Plug and Play
var pnp = require("./PnP");

// Routers
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
if (process.env.STEPPER_USE === "true") {
  var ExtruderRouter = require("./routes/api/extruder");
  var FiberRouter = require("./routes/api/fiber");
}
if (process.env.HEATER_USE === "true") {
  var HeaterRouter = require("./routes/api/temperature");
}
if (process.env.MICROMETER_USE === "true") {
  var MicrometerRouter = require("./routes/api/micrometer");
}
var adminRouter = require("./routes/admin");
var recordRouter = require("./routes/record");

var app = express();

// Connect to MongoDB
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

//set routers
app.use("/", indexRouter);
app.use("/api/users", usersRouter);
if (process.env.STEPPER_USE === "true") {
  app.use("/api/extruder", ExtruderRouter);
  app.use("/api/fiber", FiberRouter);
}
if (process.env.HEATER_USE === "true") {
  app.use("/api/temperature", HeaterRouter);
}
if (process.env.MICROMETER_USE === "true") {
  app.use("/api/diameter", MicrometerRouter);
}
app.use("/api/admin", adminRouter);
app.use("/api/record", recordRouter);

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
