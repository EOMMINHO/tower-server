// Include the Arduino Stepper Library
#include <Arduino.h>

// Number of steps per output rotation
#define MOTOR_STEPS 200 // For 1.8 degrees/step motors
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
#define MS1 10
#define MS2 11
#define MS3 12

#define BOTTOM_PIN 6
#define TOP_PIN 7

// interval in microseconds
// current_interval = (3*10^5)/(RPM)
long current_interval = 500;
double current_RPM = 60;
int current_DIR = HIGH;

// for non blocking function
unsigned long previousMicros = 0;

void setup()
{
  // limit switch setting
  pinMode(BOTTOM_PIN, INPUT);
  pinMode(TOP_PIN, INPUT);

  pinMode(DIR, OUTPUT);
  pinMode(STEP, OUTPUT);
  pinMode(MS1, OUTPUT);
  pinMode(MS2, OUTPUT);
  pinMode(MS3, OUTPUT);

  // only full steps are used.
  digitalWrite(MS1, LOW);
  digitalWrite(MS2, LOW);
  digitalWrite(MS3, LOW);

  // initialize the serial port:
  Serial.begin(115200);
}

void loop()
{
  handleSerial();
}

void handleSerial()
{
  while(Serial.available() > 0){
    // get serial input
    String incomingString = Serial.readStringUntil('\n');
    int clength = incomingString.length();

    // set RPM
    double incomingRev = incomingString.toDouble();
    current_RPM = incomingRev;
    current_interval = (3e+5)/(current_RPM);

    // set direction
    char incomingDir = incomingString[clength-1];

    switch(incomingDir){
      case '+':
        current_DIR = HIGH;
        digitalWrite(DIR, HIGH);
        break;
      case '-':
        current_DIR = LOW;
        digitalWrite(DIR, LOW);
        break;
    }

    // actual turning
    handleMove();
  }
}

void handleMove()
{
  while(true){
    unsigned long currentMicros = micros();

    if(currentMicros - previousMicros >= current_interval){
      previousMicros = currentMicros;

      // delay at least 2 microseconds
      digitalWrite(STEP, HIGH);
      delayMicroseconds(2);
      digitalWrite(STEP, LOW);

      // left time
      // (1) serial command
      if(Serial.available() > 0) {
        String incomingString = Serial.readStringUntil('\n');
        if(incomingString.equals("stop")){ // stop command => wait for another serial input
          digitalWrite(STEP, LOW);
          current_RPM = 0;
          return;
        }else{ // speed command => change speed immediately
          int clength = incomingString.length();
          double incomingRPM = incomingString.toDouble();
          char incomingDIR = incomingString[clength-1];

          // change global variables
          current_RPM = incomingRPM;
          current_interval = (3e+5)/(current_RPM);
          switch(incomingDir){
            case '+':
              current_DIR = HIGH;
              digitalWrite(DIR, HIGH);
              break;
            case '-':
              current_DIR = LOW;
              digitalWrite(DIR, LOW);
              break;
          }
          break;
        }
      }
      // (2) limit switch 
      if(digitalRead(BOTTOM_PIN) == HIGH){
        //digitalWrite(DIR, !current_DIR);
        digitalWrite(STEP, LOW);
        return;
      }

      //end left time
    }


  }
}
