// Include the Arduino Stepper Library
#include <Stepper.h>

// Number of steps per output rotation
const int stepsPerRevolution = 200;

// Create Instance of Stepper library
Stepper myStepper(stepsPerRevolution, 8, 9, 10, 11);


void setup()
{
  // set the speed at 60 rpm:
  // myStepper.setSpeed(60);
  // initialize the serial port:
  Serial.begin(9600);
}

void loop() 
{
  handleSerial();
}

void handleSerial(){
  while(Serial.available() > 0){
    String incomingString = Serial.readStringUntil('\n');
    int clength = incomingString.length();
    double incomingRev = incomingString.toDouble();
    myStepper.setSpeed(incomingRev);
    Serial.print("speed: ");
    Serial.print(incomingRev);
    Serial.print(" ");

    //direction control
    //run stepper motor until other serial command comes
    char incomingDir = incomingString[clength-1];
    switch(incomingDir){
      case '+':
        Serial.println("clockwise");
        while(!Serial.available()) myStepper.step(stepsPerRevolution);
        break;
      case '-':
        Serial.println("counterclockwise");
        while(!Serial.available()) myStepper.step(-stepsPerRevolution);
        break;
    }
  }
 }
