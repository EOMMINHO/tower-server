const mongoose = require("mongoose");

//make temp schema
const projectSchema = new mongoose.Schema({
  projectName: String,
  updated: Date,
  temp: Number,
  recordDate: [Date],
  diameter: [Number]
});

//make temp model
const Project = mongoose.model("Project", projectSchema);

module.exports.Project = Project;
