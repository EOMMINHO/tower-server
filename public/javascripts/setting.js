const temp = document.querySelector("#temp");
const speed1 = document.querySelector("#speed1");
const speed2 = document.querySelector("#speed2");
const setBtn = document.querySelector("#set");

temp.addEventListener("keyup", e => {
  if (event.code === "Enter" || event.code === "NumpadEnter") {
    speed1.focus();
  }
});

speed1.addEventListener("keyup", e => {
  if (event.code === "Enter" || event.code === "NumpadEnter") {
    speed2.focus();
  }
});

speed2.addEventListener("keyup", e => {
  if (event.code === "Enter" || event.code === "NumpadEnter") {
    setBtn.focus();
  }
});

setBtn.addEventListener("click", e => {
  let tempVal = temp.value;
  let speed1Val = speed1.value;
  let speed2Val = speed2.value;

  //send POST to stepper and temperature API

  //change the graph to show success
});

//constantly update the temperature graph
