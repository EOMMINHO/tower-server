require("dotenv").config();
var express = require("express");
var router = express.Router();
const SerialPort = require("serialport");
const ModbusMaster = require("modbus-rtu").ModbusMaster;

//create serail port with params. Refer to node-serialport for documentation
const serialPort = new SerialPort(process.env.HEATER_DEV, {
  baudRate: parseInt(process.env.HEATER_BAUD)
});

//create ModbusMaster instance and pass the serial port object
const master = new ModbusMaster(serialPort);

//get the current temperature with tenths of degree.
router.get("/", function(req, res, next) {
  master.readHoldingRegisters(process.env.HEATER_SLAVE, 1000, 1).then(
    temp_array => {
      let temp = temp_array[0];
      res.send({
        temp: temp
      });
    },
    err => {
      console.log("error", err);
      res
        .status(500)
        .send({ error: "something is wrong!! check your device!" });
    }
  );
});

//set the setpoint with tenths of degree.
router.post("/", function(req, res, next) {
  let temp = req.body.temp;
  master.writeSingleRegister(process.env.HEATER_SLAVE, 1001, temp).then(
    success => {
      res.send({
        temp: temp
      });
    },
    err => {
      console.log("error", err);
      res
        .status(500)
        .send({ error: "something is wrong!! check your device!" });
    }
  );
});

module.exports = router;
