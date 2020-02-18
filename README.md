# Fiber Drawing Tower Server

## Overview

It is a fiber drawing tower server for [BNILab, KAIST](https://www.bnilab.com/) :smile:

It is made for use with various devices including but not limited to, Android, IOS, Web browsers to control the fiber drawing tower in BNILab, KAIST. Andriod and IOS application can be downloaded separately.

:exclamation: This is an API server repository and the [client repository](https://github.com/EOMMINHO/tower-client) is available separately.

### Updates

- [x] REST API for heater
- [x] REST API for stepper
- [x] arduino code for stepper
- [x] authentification
- [x] authorization
- [x] On/Off status
- [x] status database
- [ ] DB encryption
- [ ] PID controlling
- [ ] Plug and Play
- [ ] delete user

## Acknowledgments
This program and physical devices has taken several months to make and benefited from contributions of many individuals. I wish to thank the following for their helps: Joon Hee Won(KAIST), Seongjun Park(KAIST), David Donghyun Kim(Massachusetts Institute of Technology).
I thank all other members, BNILab, KAIST.

Minho Eom.

## (Prerequisite) 1. Device setup

You will setup devices for a fiber drawing tower here.

### 1. Stepper motor

Hardware Used: A4988 stepper motor driver, NEMA17 stepper motor, Arduino board

The current host sends command by serial communication without any protocol.
The update version will include protocol with error recovery.

Arduino need a program in the folder: "/dev/extruder/extruder.ino" and "/dev/fiber/fiber.ino" for extruder motor and fiber motor respectively.

#### Schematics

will be updated later...

#### serial communications information

All commands need to finish with '\n' character. The first part includes the double data type and can including dot notation, which represents the speed of a stepper motor. The unit is revolution per minute. The second part include a single character either '+' or '-'. Each means clockwise and counterclockwise respectively.
To stop the stepper motor, command "stop".

e.g.) "12.31+\n": Turn the stepper motor with 12.31 RPM clockwise.

e.g.) "31.22-\n": Turn the stepper motor with 31.22 RPM counterclockwise.

e.g.) "stop\n": Stop the stepper motor.

### 2. Heater

Hardware used: HDC00011, PT1000, CN142-R1-DC2-C4

The communication is held by Modbus protocol. The slave number can be chosen on **.env** file.

#### Schematics

will be updated later...

#### serial communications information

- Modbus register number
- 1000: The current process temperature by tenths of degree.
- 1001: The current set temperature by tenths of degree.

### 3. Laser Micrometer (optional)

It is possible not to use laser micrometer. However, using it will enable you to use feedback control to help maintain constant diameter of fiber.

we used [LS9006 model](https://www.keyence.com/products/measure/micrometer/ls-9000/) for < 200 micrometer scale fiber.

The communication is held by RS232 protocol.

#### Schematics

will be updated later...

## (Prerequisite) 2. Server setup

You will configure DB, environment variables, and NodeJS here.

### 1. Database

We use MongoDB for authentication, authorization, and saving other user project data.

Download and install the right version on [download center](https://www.mongodb.com/download-center/community).

* /data/db folder permission required for MongoDB.
* Use MongoDB Compass for GUI interaction.
* command as "$ mongod --bind_ip_all" to connect it remotely.

### 2. Environment Configuration

There is **.env** file in the root directory. Change the environment variables to configure your own machine.

- STEPPER_USE : (boolean) whether using it or not
- STEPPER1_DEV : preform stepper device path
- STEPPER1_BAUD : preform stepper device baud-rate
- STEPPER2_DEV : fiber stepper device path
- STEPPER2_BAUD : fiber stepper device baud-rate
- HEATER_USE : (boolean) whether using it or not
- HEATER_DEV : heater device path
- HEATER_BAUD : heater device baud-rate
- HEATER_SLAVE : heater device Mosbus slave number
- MICROMETER_USE : (boolean) whether using it or not
- MICROMETER_DEV : micrometer device path
- MICROMETER_BAUD : micrometer baud-rate
- PORT : port used by the server
- DB_HOST : name of the host DB
- DB_PORT : port used by the host DB
- DB_SUNAME : superuser ID for DB
- DB_PW : password of SU for DB
- JWT_PRIVATE_KEY : private key used for encrypting JWT

### 3. Node.js

We use Node.js. Download it on the [offical website](https://nodejs.org/en/).
After then, open a terminal and follow the instructions below.

1. npm install
2. npm start

## Let's start using!

This is an REST API server, and if you configured devices correctly, the server will now work!

To request via API call, you would need to install [postman](https://www.postman.com/) on your client side computer. The following is the general concept of request.

1. POST the temperature, stepper speed, and fiber diameter. The minimum and maximum of them exist.
2. GET current status.

All body requirements are writen as [Joi](https://hapi.dev/family/joi/tester/) statement. 

Every authorized API call requires valid x-auth-token in headers.

### Details (user information)

We use REST API to update and record user information for their projects.

#### 1. Sign-Up

You can make an account

(1) POST http://serverName:portNumber/api/users/signUp

Body
- id: string.min(3).max(30)
- pw: string.min(3).max(30)

#### 2. Sign-In

You can be authenticated.

(1) POST http://serverName:portNumber/api/users/signIn

Body
- id: string.min(3).max(30)
- pw: string.min(3).max(30)

Return
- x-auth-token: use it for authorized API call

#### 3. Record Project

You can record and see the project. (only for authorized user)

(1) POST http://serverName:portNumber/api/record/writeProject

Body
- projectName: Joi.string()
    .min(2)
    .max(100)
- updated: Joi.string().isoDate()
- temp: Joi.number()
    .integer()
    .min(50)
    .max(300)
- recordDate: Joi.array().items(Joi.string())
- diameter: Joi.array().items(Joi.number())

(2) POST http://serverName:portNumber/api/record/readProject

Body
- projectName: Joi.string()
    .min(2)
    .max(100)

#### 4. Admin Tools

You can find users and change authorization. (only for admin)

(1) POST http://serverName:portNumber/api/admin/findEveryUser

Body
- NULL

(2) POST http://serverName:portNumber/api/admin/findUserInfo

Body
- id: Joi.string()
    .min(3)
    .max(30)

(3) POST http://serverName:portNumber/api/admin/changeAuth

Body
- id: Joi.string()
    .min(3)
    .max(30)
- isAuthorized: Joi.boolean()

### Details (sensor and actuators)

We use REST API to update current state of motor and heater.

These APIs will not be available for the unauthorized users.

#### 1. Stepper motor

You can see and change the motor speed (only for authorized user)

(1-1) GET http://serverName:portNumber/api/extruder

(1-2) GET http://serverName:portNumber/api/fiber

returns the current status of motors

(2-1) POST http://serverName:portNumber/api/extruder

(2-2) POST http://serverName:portNumber/api/fiber

Body
- stop: Joi.boolean()
- speed: Joi.number()
    .min(1)
    .max(270)
- direction: Joi.string()
    .length(1)
    .pattern(/^[+-]$/)

updates the current status of motors

- The speed must be lower than 250 RPM for reliable operation.
- 250 ~ 270 RPM is available without stability

#### 2. Heater

You can see and change the temperature of the heater (only for authorized user)

(1) GET http://serverName:portNumber/api/temperature

returns the current temperature of heater with tenths of degrees

(2) POST http://serverName:portNumber/api/temperature

Body
- temp: Joi.number()
    .integer()
    .min(50)
    .max(300)

updates the set points with tenths of degrees

- The temperature must be lower than 400 degrees celsius for reliable operation
- Temperature can be up to 565 degrees celsius without stability

#### 3. Micrometer

It is only enabled if you had a micrometer setting. If not, you can still run your machine in a open-loop way! (only for authorized user)

(1) GET http://serverName:portNumber/api/micrometer

returns the current diameter of a fiber in micrometer unit

(2) POST http://serverName:portNumber/api/micrometer

Body
- diameter: Joi.number()
    .integer()
    .min(100)
    .max(500)

updates the set diameter in micrometer unit.

## WATCH OUT!

It uses high power heaters to draw fiber from a preform. It can cause severe damage to you.

Always be careful while using it !!!


## Extra Notes

I used NodeJS, Express, JsonWebToken, MongoDB & Mongoose, SerialPort, Modbus.

## Further Inquiry

:wave: Please contact to the author: Minho Eom, KAIST, djaalsgh159@kaist.ac.kr
