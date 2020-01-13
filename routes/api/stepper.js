require("dotenv").config();
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
var express = require("express");
var router = express.Router();
const stepper1 = new SerialPort(process.env.STEPPER1, { baudRate: 9600 });
const stepper2 = new SerialPort(process.env.STEPPER2, { baudRate: 9600 });

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

router.get("/", function(req, res, next) {
  res.send({
    speed1: speed1,
    speed2: speed2,
    direction1: direction1,
    direction2: direction2
  });
});

// update the speed of the motor
router.post("/", function(req, res, next) {
  speed1 = req.body.speed1;
  direction1 = req.body.direction1;
  speed2 = req.body.speed2;
  direction2 = req.body.direction2;
  // command via serial
  stepper1.write(speed1 + direction1 + "\n");
  stepper2.write(speed2 + direction2 + "\n");
  // end command
  res.send({
    speed1: speed1,
    speed2: speed2,
    direction1: direction1,
    direction2: direction2
  });
});

module.exports = router;
