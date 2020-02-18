require("dotenv").config();
const _ = require("lodash");
const { Project } = require("../model/project");
const { authUser } = require("../middleware/auth");
var express = require("express");
var router = express.Router();
const Joi = require("@hapi/joi");

/*
 * record project API
 *
 * Body: projectName(String), updated(String), temp(Number)
 */
// schema
const writeProjectSchema = Joi.object({
  projectName: Joi.string()
    .min(2)
    .max(100),
  updated: Joi.string().isoDate(),
  temp: Joi.number()
    .integer()
    .min(50)
    .max(300),
  recordDate: Joi.array().items(Joi.string()),
  diameter: Joi.array().items(Joi.number())
});

router.post("/writeProject", authUser, async function(req, res) {
  let projectName = req.body.projectName;
  let updated = req.body.updated;
  let temp = req.body.temp;
  let recordDate = req.body.recordDate;
  let diameter = req.body.diameter;

  // data type checking
  const { error, value } = writeProjectSchema.validate({
    projectName: projectName,
    updated: updated,
    temp: temp,
    recordDate: recordDate,
    diameter: diameter
  });
  if (error !== undefined) {
    res.status(400).send(error.details[0].message);
  }

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
// schema
const readProjectSchema = Joi.object({
  projectName: Joi.string()
    .min(2)
    .max(100)
});

router.post("/readProject", authUser, async function(req, res) {
  let projectName = req.body.projectName;

  // data type checking
  const { error, value } = readProjectSchema.validate({
    projectName: projectName
  });
  if (error !== undefined) {
    res.status(400).send(error.details[0].message);
  }

  let project = await Project.findOne({ projectName: projectName });

  if (!project) res.status(400).send("No such project");

  res.send(project);
});

//exports
module.exports = router;
