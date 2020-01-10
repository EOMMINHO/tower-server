const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
var express = require("express");
var router = express.Router();
//const stepper1 = new SerialPort("/dev/ttyACM0", { baudRate: 9600 });
//const stepper2 = new SerialPort("/dev/ttyACM0", { baudRate: 9600 });

const parser1 = new Readline();
const parser2 = new Readline();
//stepper1.pipe(parser1);
//stepper2.pipe(parser2);

parser1.on("data", line => console.log(`> ${line}`));
parser2.on("data", line => console.log(`> ${line}`));

// current state of arduino
let speed1 = 0,
  speed2 = 0;

router.get("/", function(req, res, next) {
  res.send({
    speed1: speed1,
    speed2: speed2
  });
});

router.put("/", function(req, res, next) {
  speed1 = req.body.speed1;
  speed2 = req.body.speed2;
  res.send({
    speed1: speed1,
    speed2: speed2
  });
});

module.exports = router;
