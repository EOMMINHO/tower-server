let Controller = require("node-pid-controller");

// default controller
let ctr = new Controller({
  k_p: 0.25,
  k_i: 0.01,
  k_d: 0.01,
  dt: 0.1
});
ctr.setTarget(200);

// generate new controller
function GeneratePID(P, I, D, desiredDiamter) {
  ctr = new Controller({
    k_p: P,
    k_i: I,
    k_d: D,
    dt: 0.1
  });

  ctr.setTarget(desiredDiamter);
}

// start PID control
function PIDcontrol(currentDiamter) {
  let input = ctr.update(currentDiamter);
  applyInputToMotor(input);
}

// apply PID output to motor
function applyInputToMotor(input) {
  //TODO: motor algorithm
  return 0;
}

function currentCtr() {
  console.log(ctr);
}

module.exports = { GeneratePID, PIDcontrol, currentCtr };
