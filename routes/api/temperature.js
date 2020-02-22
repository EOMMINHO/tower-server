require("dotenv").config();
const { authUser } = require("../../middleware/auth");
var express = require("express");
var router = express.Router();
const SerialPort = require("serialport");
const ModbusMaster = require("modbus-rtu").ModbusMaster;
const Joi = require("@hapi/joi");

//create serial port with params. Refer to node-serialport for documentation
const serialPort = new SerialPort(process.env.HEATER_DEV, {
  baudRate: parseInt(process.env.HEATER_BAUD)
});

//create ModbusMaster instance and pass the serial port object
const master = new ModbusMaster(serialPort);

//get the current temperature with tenths of degree.
router.get("/", authUser, async function(req, res, next) {
  let tempArray = await master.readHoldingRegisters(
    process.env.HEATER_SLAVE,
    1000,
    2
  );
  let relayStatusArray = await master.readHoldingRegisters(
    process.env.HEATER_SLAVE,
    1008,
    1
  );
  let onStatusArray = await master.readHoldingRegisters(
    process.env.HEATER_SLAVE,
    1015,
    1
  );
  let temp = tempArray[0];
  let setTemp = tempArray[1];
  let relayStatus = relayStatusArray[0];
  let onStatus = onStatusArray[0];
  res.send({
    temp: temp,
    setTemp: setTemp,
    relayStatus: relayStatus,
    onStatus: onStatus
  });
});

//schema
const schema = Joi.object({
  temp: Joi.number()
    .integer()
    .min(0)
    .max(400)
});

//set the setpoint with tenths of degree.
router.post("/", authUser, function(req, res, next) {
  let temp = req.body.temp;
  // data type checking
  const { error, value } = schema.validate({ temp: temp });
  if (error !== undefined) {
    res.status(400).send(error.details[0].message);
    return;
  }
  temp = temp * 10;

  // if not error, write via Modbus protocol
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
