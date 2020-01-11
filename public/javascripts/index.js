// const temp = document.querySelector("#temperature");
// const speed = document.querySelector("#speed");
// const button = document.querySelector("#set");
// const currentTmp = document.querySelector("#currentTmp");

// let temp_value, speed_value;

// button.addEventListener("click", () => {
//   temp_value = temp.value;
//   speed_value = speed.value;
//   currentTmp.innerHTML = "clicked";
//   //PUT speed and temperature to API

//   //fetch from the api and set innerHTML
//   setInterval(function() {
//     let time = Date.now();
//     currentTmp.innerHTML = time;
//   }, 500);
// });
var socket = io();
const form = document.querySelector("form");
const message = document.querySelector("#m");
const messages = document.querySelector("#messages");

form.addEventListener("submit", function(e) {
  e.preventDefault();
  socket.emit("chat message", message.value);
  message.value = "";
  return false;
});

socket.on("chat message", msg => {
  let node = document.createElement("li");
  node.innerHTML = msg;
  messages.append(node);
});
