const SerialPort = require("serialport");

async function listSerial() {
  let listResult = await SerialPort.list();

  console.log(listResult);
}

listSerial();
