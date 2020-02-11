require("dotenv").config();
const { authUser } = require("../../middleware/auth");
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
var express = require("express");
var router = express.Router();

// set up serial port
const fiber = new SerialPort(process.env.STEPPER2_DEV, {
  baudRate: parseInt(process.env.STEPPER2_BAUD)
});

const parser = new Readline();

fiber.pipe(parser);

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

// update the speed of the motor
router.post("/", authUser, function(req, res, next) {
  stop = req.body.stop;
  speed = req.body.speed;
  direction = req.body.direction;

  // command via serial and send back to user
  if (stop || speed === "0") {
    fiber.write("stop\n");
    onStatus = false;
    res.send({
      stop: "complete!"
    });
  } else {
    fiber.write(speed + direction + "\n");
    onStatus = true;
    res.send({
      speed: speed,
      direction: direction
    });
  }
});

module.exports = router;
