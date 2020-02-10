// Include the Arduino Library
#include <Arduino.h>

// Number of steps per output rotation
#define MOTOR_STEPS 200 // For 1.8 degrees/step motors

// The pin Arduino
#define BOTTOM_PIN 6
#define TOP_PIN 7
#define DIR 8
#define STEP 9
#define MS1 10
#define MS2 11
#define MS3 12

// interval in microseconds
// current_interval = (3*10^5)/(RPM)
long current_interval = 150000;
double current_RPM = 2;
int current_DIR = HIGH; //HIGH direction => down, LOW direction => up

// GLOBAL VARIABLES
unsigned long previousMicros = 0; // for non blocking function
bool TOP_PIN_flag = false;

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

  // only full steps will be used in the current system.
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
  /*
  Serial input form
  (floating point number)('+' or '-')('\n')
  floating point number: speed(RPM) 
  ('+' or '-'): direction
  ('\n'): delimiter
  */
  while(Serial.available() > 0){
    // get serial input
    String incomingString = Serial.readStringUntil('\n');
    int clength = incomingString.length();

    // get RPM and diretion
    double incomingRev = incomingString.toDouble();
    char incomingDir = incomingString[clength-1];

    //set parameters
    current_RPM = incomingRev;
    current_interval = (3e+5)/(current_RPM);
    if(incomingDir == '+'){
        current_DIR = HIGH;
        digitalWrite(DIR, HIGH);
    }else if(incomingDir == '-'){
        current_DIR = LOW;
        digitalWrite(DIR, LOW);
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
        if(incomingString.equals("stop")){ // stop command
          digitalWrite(STEP, LOW);
          current_RPM = 0;
          return;
        }else{ // speed command => change speed immediately
          // get RPM, diretion, and location
          double incomingRev = incomingString.toDouble();
          char incomingDir = incomingString[clength-1];

          //set parameters
          current_RPM = incomingRev;
          current_interval = (3e+5)/(current_RPM);
          if(incomingDir == '+'){
            current_DIR = HIGH;
            digitalWrite(DIR, HIGH);
          }else if(incomingDir == '-'){
            current_DIR = LOW;
            digitalWrite(DIR, LOW);
          }

        }
      }

      // (2) limit switch (bottom)
      // HIGH bottom pin means the motor must go up faster (200RPM)
      if(digitalRead(BOTTOM_PIN) == HIGH){
        digitalWrite(DIR, current_DIR = LOW);
        current_RPM = 200;
        current_interval = (3e+5)/(current_RPM);
      }

      // (3) limit switch (top)
      // HIGH top pin means the motor must stop
      if(digitalRead(TOP_PIN) == HIGH){ // going up process
        digitalWrite(DIR, current_DIR = HIGH);
        TOP_PIN_flag = true;
      }else if(TOP_PIN_flag){ // going down process
        TOP_PIN_flag = false;
        digitalWrite(STEP, LOW);
        current_RPM = 0;
        return;
      }

      //end left time
    }
  }
}
