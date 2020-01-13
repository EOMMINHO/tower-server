require("dotenv").config();
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
var express = require("express");
var router = express.Router();
const stepper1 = new SerialPort(process.env.STEPPER1, { baudRate: 9600 });

const parser1 = new Readline();

stepper1.pipe(parser1);

parser1.on("data", line => console.log(`> ${line}`));

// current state of arduino
let speed1 = 0;
let direction1 = "+";

router.get("/", function(req, res, next) {
  res.send({
    speed1: speed1,
    direction1: direction1
  });
});

// update the speed of the motor
router.post("/", function(req, res, next) {
  speed1 = req.body.speed1;
  direction1 = req.body.direction1;
  stepper1.write(speed1 + direction1 + "\n");
  res.send({
    speed1: speed1,
    direction1: direction1
  });
});

module.exports = router;
