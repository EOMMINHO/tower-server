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

#define UP LOW
#define DOWN HIGH

// interval in microseconds
// current_interval = (3*10^5)/(RPM)
long current_interval = 150000;
double current_RPM = 2;
int current_DIR = HIGH; //HIGH direction => down, LOW direction => up

// GLOBAL VARIABLES
unsigned long previousMicros = 0; // for non blocking function
bool TOP_PIN_flag = false;
bool delay_flag_BOTTOM = true;
bool delay_flag_TOP = true;

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
        current_DIR = UP;
        digitalWrite(DIR, UP);
    }else if(incomingDir == '-'){
        current_DIR = DOWN;
        digitalWrite(DIR, DOWN);
    }

    // actual turning
    Serial.println("Extruder Process Starts");
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
          int clength = incomingString.length();
          double incomingRev = incomingString.toDouble();
          char incomingDir = incomingString[clength-1];

          //set parameters
          current_RPM = incomingRev;
          current_interval = (3e+5)/(current_RPM);
          if(incomingDir == '+'){
            current_DIR = UP;
            digitalWrite(DIR, UP);
          }else if(incomingDir == '-'){
            current_DIR = DOWN;
            digitalWrite(DIR, DOWN);
          }

        }
      }

      // (2) limit switch (bottom)
      // HIGH bottom pin means the motor must go up faster (200RPM)
      if(digitalRead(BOTTOM_PIN) == HIGH){
        current_DIR = UP;
        digitalWrite(DIR, UP);
        current_RPM = 200;
        current_interval = (3e+5)/(current_RPM);
        if(delay_flag_BOTTOM){
            digitalWrite(STEP, LOW);
            delay(1000);
            delay_flag_BOTTOM = false;
        }
        Serial.println("Extruder Process Complete");
      }

      // (3) limit switch (top)
      // HIGH top pin means the motor must stop
      if(digitalRead(TOP_PIN) == HIGH){ // clicked and going down
        current_DIR = DOWN;
        digitalWrite(DIR, DOWN);
        if(delay_flag_TOP){
            digitalWrite(STEP, LOW);
            delay(1000);
            delay_flag_TOP = false;
        }
        TOP_PIN_flag = true;
      }else if(TOP_PIN_flag){ // process complete
        TOP_PIN_flag = false;
        digitalWrite(STEP, LOW);
        current_RPM = 0;
        Serial.println("Extruder Process Initialized");
        delay_flag_TOP = true;
        delay_flag_BOTTOM = true;
        return;
      }

      //end left time
    }
  }
}
