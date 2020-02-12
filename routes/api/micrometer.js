require("dotenv").config();
const { authUser } = require("../../middleware/auth");
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
var express = require("express");
var router = express.Router();

// setting serial ports
const micrometer = new SerialPort(process.env.MICROMETER_DEV, {
  baudRate: parseInt(process.env.MICROMETER_BAUD)
});

const parser = new Readline();

micrometer.pipe(parser);

// current state of micrometer
let diameter = "";

parser.on("data", line => {
  console.log(`> ${line}`);
  diameter = line;
});

micrometer.write("MS,0,01,\r");

// router methods
router.get("/", authUser, function(req, res, next) {
  res.send({
    diameter: diameter
  });
});

router.post("/", authUser, function(req, res, next) {
  diameter = req.body.diameter;
  res.send("diameter set to " + diameter);
});

module.exports = router;
