// Include the Arduino Stepper Library
#include <Arduino.h>
#include "A4988.h"

// Number of steps per output rotation
#define MOTOR_STEPS 200 // For 1.8 degrees/step motors
#define MICRO_MODE 1 
/* 
 * With A4988 driver, can choose: 1, 2, 4, 8, or 16
 * Mode 1 is full speed.
 * Mode 16 is 16 microsteps per step.
 * The speed runs as the set RPM but precision increased.
 */

// The pin Arduino
#define DIR 8
#define STEP 9
#define SLEEP 13 // optional (just delete SLEEP from everywhere if not used)

#define MS1 10
#define MS2 11
#define MS3 12

// Instantiate stepper
A4988 stepper(MOTOR_STEPS, DIR, STEP, SLEEP, MS1, MS2, MS3);

void setup()
{
  // initialize the serial port:
  Serial.begin(115200);

  // set stepper
  stepper.begin();
  stepper.enable();
  stepper.setMicrostep(MICRO_MODE);
}

void loop() 
{
  handleSerial();
}

// until command "stop\n", it rotates forever.
void handleMove(long angle){
  while(true){
   stepper.startRotate(angle);
   while(true){
    if(Serial.available() > 0) {
      String incomingString = Serial.readStringUntil('\n');
      if(incomingString.equals("stop")){
        stepper.stop();
        return;
      }
    }
    long wait_time_micros = stepper.nextAction();
    if (wait_time_micros <= 0){
      break;
    }
   }
  }
}

void handleSerial(){
  while(Serial.available() > 0){
    // get serial input
    String incomingString = Serial.readStringUntil('\n');
    int clength = incomingString.length();

    // set RPM
    double incomingRev = incomingString.toDouble();
    stepper.setRPM(incomingRev);

    // for debugging (erase for production)
    Serial.print("speed: ");
    Serial.print(incomingRev);
    Serial.print(" ");
    // debugging end

    //direction control
    //run stepper motor until other serial command comes
    char incomingDir = incomingString[clength-1];
    switch(incomingDir){
      case '+':
        Serial.println("cw");
        handleMove(360); // this is a non-blocking function
        break;
      case '-':
        Serial.println("ccw");
        handleMove(-360);
        break;
    }
  }
 }
