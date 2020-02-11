require("dotenv").config();
const _ = require("lodash");
const { Project } = require("../model/project");
const { authUser } = require("../middleware/auth");
var express = require("express");
var router = express.Router();

/*
 * record project API
 *
 * Body: projectName(String), date(String), temp(Number)
 */
router.post("/writeProject", authUser, async function(req, res) {
  let projectName = req.body.projectName;
  let updated = req.body.updated;
  let temp = req.body.temp;
  let recordDate = req.body.recordDate;
  let diameter = req.body.diameter;

  //change String array to date array
  let newDate = recordDate.map(current => {
    return new Date(current);
  });

  project = new Project({
    projectName: projectName,
    updated: updated,
    temp: temp,
    recordDate: newDate,
    diameter: diameter
  });

  await project.save();

  res.send(projectName + " recorded complete");
});

/*
 * Get recorded project API
 */
router.post("/readProject", authUser, async function(req, res) {
  let projectName = req.body.projectName;

  let project = await Project.findOne({ projectName: projectName });

  if (!project) res.status(400).send("No such project");

  res.send(project);
});

//exports
module.exports = router;
