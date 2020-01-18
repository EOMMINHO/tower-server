# Fiber Drawing Tower Server

## Overview

It is a fiber drawing tower server for [BNILab, KAIST](https://www.bnilab.com/) :smile:

It is made for use with various devices including but not limited to, Android, IOS, Web browsers to control the fiber drawing tower in BNILab, KAIST. The Andriod and IOS application can be downloaded separately while the web application is provided by through web.

Used frameworks are Node.js and Express.

:exclamation: This is a server repository and the [client repository](https://github.com/EOMMINHO/tower-client) is available separately.

### Updates

- [x] REST API for heater
- [ ] REST API for stepper
- [ ] arduino code for stepper
- [ ] real-time data transfer with socket
- [ ] authentification

## How to use

Select the temperature and the speed of motor.
The minimum and maximum of them are fixed.
The current status of them will be shown.

The PID controlling of motor is not yet deployed and will be developed after getting a laser micrometer.

### Environment Configuration

There is **.env** file in the root directory. Change the environment variables to configure your own machine.

- STEPPER1_DEV : the preform stepper device path
- STEPPER1_BAUD : the preform stepper device baud-rate
- STEPPER2_DEV : the fiber stepper device path
- STEPPER2_BAUD : the fiber stepper device baud-rate
- HEATER_DEV : the heater device path
- HEATER_BAUD : the heater device baud-rate
- HEATER_SLAVE : the heater device Mosbus slave number

### REST API

We use REST API to update current state of motor and heater.

#### 1. Stepper motor

GET http://serverName:portNumber/api/stepper: returns the current status of motors

POST http://serverName:portNumber/api/stepper, body: { speed1: Number, direction1: String }: updates the current status of motors

#### 2. Heater

GET http://serverName:portNumber/api/temperature: returns the current temperature of heater with tenths of degrees

POST http://serverName:portNumber/api/temperature, body: { temp: Number }: updates the set points with tenths of degrees

## Arduino setup

### 1. Stepper motor

Hardware Used: A4988 stepper motor driver, NEMA17 stepper motor, Arduino board

The host sends command by serial communication.

#### Schematics

will be added later...

#### command info

All commands need to finish with '\n' character. The first part includes the double data type and can including dot notation, which represents the speed of a stepper motor. The unit is revolution per minute. The second part include a sing character either '+' or '-'. Each means clockwise and counterclockwise respectively.

e.g.) "12.31+": Turn the stepper motor with 12.31 rev/min clockwise.

e.g.) "31.22-": Turn the stepper motor with 31.22 rev/min counterclockwise.

### 2. Heater

Hardware used: HDC00011, PT1000, CN142-R1-DC2-C4

#### Schematics

will be added later...

#### command info

will be added later...

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

## Further Inquiry

:wave: Please contact to the author: Minho Eom, KAIST, djaalsgh159@kaist.ac.kr
