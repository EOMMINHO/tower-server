# Fiber Drawing Tower Server

## Overview
It is a fiber drawing tower server for [BNILab, KAIST](https://www.bnilab.com/) :smile:

It is made for use with various devices including but not limited to, Android, IOS, Web browsers to control the fiber drawing tower in BNILab, KAIST. The Andriod and IOS application can be downloaded separately while the web application is provided by through web.

Used frameworks are Node.js and Express.

## How to use
Select the temperature and the speed of motor.
The minimum and maximum of them are fixed.
The current status of them will be shown.

The PID controlling of motor is not yet deployed and will be developed after getting a laser micrometer.

## Tasks
- [ ] arduino code for heater
- [ ] arduino code for stepper
- [ ] real-time data transfer with socket
- [ ] authentification

## Front End applications
```javascript
//example code
io.on("connection", function(socket) {
  console.log("user connected!~");
  socket.on("chat message", msg => {
    setInterval(() => {
      io.emit("chat message", msg);
    }, 1000);
    //io.emit("chat message", msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected!");
  });
});
```

