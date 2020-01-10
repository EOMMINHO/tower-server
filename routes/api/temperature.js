const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
var express = require("express");
var router = express.Router();
//const controller = new SerialPort("/dev/ttyACM0", { baudRate: 9600 });

const parser = new Readline();
//controller.pipe(parser);

parser.on("data", line => console.log(`> ${line}`));

// current state of arduino
let temp = 0;

router.get("/", function(req, res, next) {
  res.send({
    temp: temp
  });
});

router.put("/", function(req, res, next) {
  temp = req.body.temp;
  res.send({
    temp: temp
  });
});

module.exports = router;
