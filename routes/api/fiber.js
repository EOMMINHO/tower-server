require("dotenv").config();
const { authUser } = require("../../middleware/auth");
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
var express = require("express");
var router = express.Router();

const stepper1 = new SerialPort(process.env.STEPPER1_DEV, {
  baudRate: parseInt(process.env.STEPPER1_BAUD)
});
const stepper2 = new SerialPort(process.env.STEPPER2_DEV, {
  baudRate: parseInt(process.env.STEPPER1_BAUD)
});

const parser1 = new Readline();
const parser2 = new Readline();

stepper1.pipe(parser1);
stepper2.pipe(parser1);

parser1.on("data", line => console.log(`> ${line}`));
parser2.on("data", line => console.log(`> ${line}`));

// current state of arduino
let speed1 = 0,
  speed2 = 0;
let direction1 = "+",
  direction2 = "+";
let onStatus = false;

router.get("/", authUser, function(req, res, next) {
  res.send({
    speed1: speed1,
    speed2: speed2,
    direction1: direction1,
    direction2: direction2,
    onStatus: onStatus
  });
});

// update the speed of the motor
router.post("/", authUser, function(req, res, next) {
  stop = req.body.stop;
  speed1 = req.body.speed1;
  direction1 = req.body.direction1;
  speed2 = req.body.speed2;
  direction2 = req.body.direction2;

  // command via serial and send back to user
  if (stop) {
    stepper1.write("stop\n");
    stepper2.write("stop\n");
    onStatus = false;
    res.send({
      stop: "complete!"
    });
  } else {
    stepper1.write(speed1 + direction1 + "\n");
    stepper2.write(speed2 + direction2 + "\n");
    onStatus = true;
    res.send({
      speed1: speed1,
      speed2: speed2,
      direction1: direction1,
      direction2: direction2
    });
  }
});

module.exports = router;
