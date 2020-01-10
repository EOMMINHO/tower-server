const temp = document.querySelector("#temperature");
const speed = document.querySelector("#speed");
const button = document.querySelector("#set");
const currentTmp = document.querySelector("#currentTmp");

let temp_value, speed_value;

button.addEventListener("click", () => {
  temp_value = temp.value;
  speed_value = speed.value;
  currentTmp.innerHTML = "clicked";
  //PUT speed and temperature to API

  //fetch from the api and set innerHTML
  setInterval(function() {
    let time = Date.now();
    currentTmp.innerHTML = time;
  }, 500);
});
