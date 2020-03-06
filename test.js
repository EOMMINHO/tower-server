const { GeneratePID, PIDcontrol, currentCtr } = require("./utils/pid");

GeneratePID(0.25, 0.1, 0.1, 400);
currentCtr();
