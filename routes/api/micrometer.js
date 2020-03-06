require("dotenv").config();
const { authUser } = require("../../middleware/auth");
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
var express = require("express");
var router = express.Router();
const Joi = require("@hapi/joi");
const { GeneratePID, PIDcontrol } = require("../../utils/pid");

// setting serial ports
const micrometer = new SerialPort(process.env.MICROMETER_DEV, {
  baudRate: parseInt(process.env.MICROMETER_BAUD)
});

const parser = new Readline();

micrometer.pipe(parser);

// current state of micrometer
let currentDiameter = 0;
let desiredDiameter = 0;
var intervalID;
let intervalTime = 100;
let turnOn = false;

// get continuous serial data from micrometer
parser.on("data", line => {
  // TODO: line to number diameter
  currentDiameter = line;
});

micrometer.write("MS,0,01,\r");

// router methods
router.get("/", authUser, function(req, res, next) {
  res.send({
    currentDiameter: currentDiameter
  });
});

// schema
const schema = Joi.object({
  P: Joi.number(),
  I: Joi.number(),
  D: Joi.number(),
  diameter: Joi.number()
    .integer()
    .min(100)
    .max(500)
});

// change PID parameter setting of PID controller
router.post("/pidSetting", authUser, function(req, res, next) {
  P = req.body.P;
  I = req.body.I;
  D = req.body.D;
  desiredDiameter = req.body.desiredDiameter;
  // data type checking
  const { error, value } = PIDschema.validate({
    P: P,
    I: I,
    D: D,
    diameter: desiredDiameter
  });
  if (error !== undefined) {
    res.status(400).send(error.details[0].message);
    return;
  }

  GeneratePID(P, I, D, desiredDiameter);
});

// turn on PID controller
router.post("/pidOn", authUser, function(req, res, next) {
  // turn on PID controller
  if (!turnOn) {
    intervalID = setInterval(PIDcontrol, intervalTime, currentDiameter);
    turnOn = true;
  }
  // if no error, send correct message
  res.send("diameter set to " + desiredDiameter);
});

// turn off PID controller
router.post("pidOff", authUser, function(req, res, next) {
  if (turnOn) {
    clearInterval(intervalID);
    turnOn = false;
  }
  res.send("PID controller turned off");
});

module.exports = router;
