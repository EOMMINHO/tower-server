// Include the Arduino Stepper Library
#include <Arduino.h>
#include "A4988.h"

// Number of steps per output rotation
#define MOTOR_STEPS 200 // For 1.8 degrees/step motors
#define MICRO_MODE 1 
#define MOTOR_ACCEL 2000
#define MOTOR_DECEL 1000
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

  // set LINEAR_SPEED (accelerated)
  stepper.setSpeedProfile(stepper.LINEAR_SPEED, MOTOR_ACCEL, MOTOR_DECEL);
}

void loop() 
{
  handleSerial();
}

// until command something, it rotates forever.
// command (1), "stop\n": stop the stepper
// command (2), speed and direction info: change the speed of stepper
void handleMove(char direction){
  char incomingDIR = '0';
  while(true){
    // set stepper rotation
    // if incomingDIR information exist, use that information.
    if(incomingDIR == '0'){
      if(direction == '+'){
        stepper.startRotate(360);
      }else if(direction == '-'){
        stepper.startRotate(-360);
      }
    }else{
      if(incomingDIR == '+'){
        stepper.startRotate(360);
      }else if(incomingDIR == '-'){
        stepper.startRotate(-360);
      }
    }
   
   // pulse generation
   while(true){
     // command checking
    if(Serial.available() > 0) {
      String incomingString = Serial.readStringUntil('\n');
      if(incomingString.equals("stop")){ // stop command
        stepper.stop();
        return;
      }else{ // speed command (changes speed)
        int clength = incomingString.length();
        double incomingRPM = incomingString.toDouble();
        incomingDIR = incomingString[clength-1];
        stepper.setRPM(incomingRPM);
        break;
      }
    }
    long wait_time_micros = stepper.nextAction();
    if(wait_time_micros){
      Serial.print("  dt="); Serial.print(wait_time_micros);
      Serial.print("  rpm="); Serial.print(stepper.getCurrentRPM());
      Serial.println();
    }else{
      // the last action
      // delay for next iteration, delay must be different for currentRPM.
      stepper.delayMicros(stepper.getTimeForMove(1));
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
