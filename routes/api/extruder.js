require("dotenv").config();
const { authUser } = require("../../middleware/auth");
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
var express = require("express");
var router = express.Router();
const Joi = require("@hapi/joi");

// set up serial port
const extruder = new SerialPort(process.env.STEPPER1_DEV, {
  baudRate: parseInt(process.env.STEPPER1_BAUD)
});

const parser = new Readline();

extruder.pipe(parser);

parser.on("data", line => console.log(`> ${line}`));

// current state of arduino
let speed = 0;
let direction = "+";
let onStatus = false;

router.get("/", authUser, function(req, res, next) {
  res.send({
    speed: speed,
    direction: direction,
    onStatus: onStatus
  });
});

// schema
const schema = Joi.object({
  stop: Joi.boolean(),
  speed: Joi.number()
    .min(1)
    .max(270),
  direction: Joi.string()
    .length(1)
    .pattern(/^[+-]$/)
});

// update the speed of the motor
router.post("/", authUser, function(req, res, next) {
  stop = req.body.stop;
  speed = req.body.speed;
  direction = req.body.direction;

  // data type checking
  const { error, value } = schema.validate({
    stop: stop,
    speed: speed,
    direction: direction
  });
  if (error !== undefined) {
    res.status(400).send(error.details[0].message);
  }

  // command via serial and send back to user
  if (stop || speed === "0") {
    extruder.write("stop\n");
    onStatus = false;
    res.send({
      stop: "complete!"
    });
  } else {
    extruder.write(speed + direction + "\n");
    onStatus = true;
    res.send({
      speed: speed,
      direction: direction
    });
  }
});

module.exports = router;
