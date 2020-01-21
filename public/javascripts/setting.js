const temp = document.querySelector("#temp");
const speed1 = document.querySelector("#speed1");
const speed2 = document.querySelector("#speed2");
const setBtn = document.querySelector("#set");
const stopBtn = document.querySelector("#stop");

temp.addEventListener("keyup", e => {
  if (e.code === "Enter" || e.code === "NumpadEnter") {
    speed1.focus();
  }
});

speed1.addEventListener("keyup", e => {
  if (e.code === "Enter" || e.code === "NumpadEnter") {
    speed2.focus();
  }
});

speed2.addEventListener("keyup", e => {
  if (e.code === "Enter" || e.code === "NumpadEnter") {
    setBtn.focus();
  }
});

setBtn.addEventListener("click", async e => {
  let tempVal = temp.value;
  let speed1Val = speed1.value;
  let speed2Val = speed2.value;

  //send POST to stepper and temperature API
  let response_stepper = await fetch(window.location.origin + "/api/stepper", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("x-auth-token")
    },
    body: JSON.stringify({
      speed1: speed1Val,
      speed2: speed2Val,
      direction1: "+",
      direction2: "+",
      stop: false
    })
  });

  let response_heater = await fetch(
    window.location.origin + "/api/temperature",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("x-auth-token")
      },
      body: JSON.stringify({
        temp: parseInt(tempVal)
      })
    }
  );

  if (response_stepper.status === 500 || response_heater.status === 500) {
    alert("some device is not working");
  }

  //change the graph to show success
});

stopBtn.addEventListener("click", e => {});

//constantly update the temperature graph
async function showTemperature() {
  let response_heater = await fetch(
    window.location.origin + "/api/temperature",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("x-auth-token")
      }
    }
  );
  let currentTemp = parseInt(await response_heater.text());
}
window.setInterval(showTemperature, 500);
