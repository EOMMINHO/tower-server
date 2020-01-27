# Fiber Drawing Tower Server

## Overview

It is a fiber drawing tower server for [BNILab, KAIST](https://www.bnilab.com/) :smile:

It is made for use with various devices including but not limited to, Android, IOS, Web browsers to control the fiber drawing tower in BNILab, KAIST. The Andriod and IOS application can be downloaded separately while the web application is provided through the server itself.

Used frameworks are Node.js and Express.

:exclamation: This is a server repository and the [client repository](https://github.com/EOMMINHO/tower-client) is available separately.

### Updates

- [x] REST API for heater
- [x] REST API for stepper
- [x] arduino code for stepper
- [x] authentification
- [x] authorization
- [ ] On/Off status
- [ ] Temperature graph
- [ ] Stepper Modbus implementation
- [ ] Database encryption

## (Prerequisite) 1. Device setup

### 1. Stepper motor

Hardware Used: A4988 stepper motor driver, NEMA17 stepper motor, Arduino board

The current host sends command by serial communication without any protocol.
The update version will include protocol with error recovery.

Arduino need a program in the folder: /dev/stepper/stepper.ino

#### Schematics

will be updated later...

#### command info

All commands need to finish with '\n' character. The first part includes the double data type and can including dot notation, which represents the speed of a stepper motor. The unit is revolution per minute. The second part include a single character either '+' or '-'. Each means clockwise and counterclockwise respectively.
To stop the stepper motor, command "stop".

e.g.) "12.31+\n": Turn the stepper motor with 12.31 rev/min clockwise.

e.g.) "31.22-\n": Turn the stepper motor with 31.22 rev/min counterclockwise.

e.g.) "stop\n": Stop the stepper motor.

### 2. Heater

Hardware used: HDC00011, PT1000, CN142-R1-DC2-C4

The communication is held by Modbus protocol. The slave number can be chosen on **.env** file.

#### Schematics

will be updated later...

#### command info

- Modbus register number
- 1000: The current process temperature by tenths of degree.
- 1001: The current set temperature by tenths of degree.

## (Prerequisite) 2. Server setup

### Database

We use MongoDB.
Download, install, and execute right version on [download center](https://www.mongodb.com/download-center/community).

### Environment Configuration

There is **.env** file in the root directory. Change the environment variables to configure your own machine.

- STEPPER1_DEV : the preform stepper device path
- STEPPER1_BAUD : the preform stepper device baud-rate
- STEPPER2_DEV : the fiber stepper device path
- STEPPER2_BAUD : the fiber stepper device baud-rate
- HEATER_DEV : the heater device path
- HEATER_BAUD : the heater device baud-rate
- HEATER_SLAVE : the heater device Mosbus slave number
- PORT : the port used by the server
- DB_HOST : the name of the host DB
- DB_PORT : the port used by the host DB
- DB_SUNAME : the superuser ID for DB
- DB_PW : the password of SU for DB
- JWT_PRIVATE_KEY : the private key used for encrypting JWT

## How to use

Use API call to

1. POST the temperature and the speed. The minimum and maximum of them exist.
2. GET current status.

The PID controlling of motor is not yet deployed and will be developed after a laser micrometer implementation.

### REST API

We use REST API to update current state of motor and heater.

#### 1. Stepper motor

GET http://serverName:portNumber/api/stepper: returns the current status of motors

POST http://serverName:portNumber/api/stepper, body: { speed1: Number, direction1: String, speed2: Number, direction2: String, stop: Boolean }: updates the current status of motors

- The speed must be lower than 300 REV/MIN for reliable operation.

#### 2. Heater

GET http://serverName:portNumber/api/temperature: returns the current temperature of heater with tenths of degrees

POST http://serverName:portNumber/api/temperature, body: { temp: Number }: updates the set points with tenths of degrees

- The temperature must be lower than 400 degrees celsius for reliable operation

## Further Inquiry

:wave: Please contact to the author: Minho Eom, KAIST, djaalsgh159@kaist.ac.kr
