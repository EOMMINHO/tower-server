const mongoose = require("mongoose");

//make temp schema
const tempSchema = new mongoose.Schema({
  projectName: String,
  date: [Date],
  temp: [Number]
});

//make temp model
const Temp = mongoose.model("Temp", tempSchema);

module.exports.Temp = Temp;
