require("dotenv").config();
const _ = require("lodash");
const { Temp } = require("../model/temp");
const { authUser } = require("../middleware/auth");
var express = require("express");
var router = express.Router();

/*
 * record temperature API
 *
 * Body: projectName(String), date(String array), temp(Number array)
 */
router.post("/temp", authUser, async function(req, res) {
  let projectName = req.body.projectName;
  let date = req.body.date;
  let temp = req.body.temp;

  //change String array to date array
  let newDate = date.map(current => {
    return new Date(current);
  });

  temp = new Temp({
    projectName: projectName,
    date: newDate,
    temp: temp
  });

  await temp.save();

  res.send(projectName + " recorded complete");
});

/*
 * Get recorded temperature API
 */
router.post("/getTemp", authUser, async function(req, res) {
  let projectName = req.body.projectName;

  let temp = await Temp.findOne({ projectName: projectName });

  if (!temp) res.status(400).send("No such project");

  res.send(temp);
});

//exports
module.exports = router;
