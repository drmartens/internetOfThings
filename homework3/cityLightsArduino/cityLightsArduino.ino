int Photo = 0;
int PhotoVal;
int PhotoMax;
int PhotoMin;


void setup() {
  // initialize serial communications at 9600 bps:
  Serial.begin(9600);
   pinMode(10,OUTPUT);
    pinMode(11,OUTPUT);
  pinMode(12,OUTPUT);
  pinMode(13,OUTPUT);


 // calibrate photoresistor during the first five seconds 
 while (millis() < 5000) {
  Serial.println("Calibrating, please wait!");
   PhotoVal = analogRead(Photo);

   // record the maximum sensor value
   if (PhotoVal > PhotoMax) {
     PhotoMax = PhotoVal;
   }

   // record the minimum sensor value
   if (PhotoVal < PhotoMin) {
     PhotoMin = PhotoVal;
   }
 }
}


//
void loop() {

  PhotoVal = analogRead(Photo);
  PhotoVal = map(PhotoVal, PhotoMin, PhotoMax, 0, 255);
   // in case the sensor value is outside the range seen during calibration
  PhotoVal = constrain(PhotoVal, 0, 255);

if (PhotoVal <= 127) {
  Serial.println("It's Night Time! Turn the lights on!");
} else if (PhotoVal >= 128) {
  Serial.println("It's Day Time! Turn the lights off!");
}

  
if (Serial.available() > 0) {

String incoming = Serial.readStringUntil('\n');
Serial.println(incoming);
if (incoming=="Atrium ON"){
  digitalWrite(10,HIGH);
  }
if (incoming=="Atrium OFF"){
  digitalWrite(10,LOW);
  }

if (incoming=="Hall ON"){
  digitalWrite(11,HIGH);
  }
if (incoming=="Hall OFF"){
  digitalWrite(11,LOW);
  }

  if (incoming=="Plant ON"){
  digitalWrite(12,HIGH);
  }
if (incoming=="Plant OFF"){
  digitalWrite(12,LOW);
  }

  if (incoming=="Wall ON"){
  digitalWrite(13,HIGH);
  }
if (incoming=="Wall OFF"){
  digitalWrite(13,LOW);
  }

if (incoming=="All ON"){
  digitalWrite(10,HIGH);
  digitalWrite(11,HIGH);
  digitalWrite(12,HIGH);
  digitalWrite(13,HIGH);
  }
if (incoming=="All OFF"){
  digitalWrite(10,LOW);
  digitalWrite(11,LOW);
  digitalWrite(12,LOW);
  digitalWrite(13,LOW);
  }

if (incoming=="Party"){
  for (int i = 0;i<10;i++) {
  digitalWrite(10,HIGH);
  delay(100);
  digitalWrite(10,LOW);
  delay(100);
  digitalWrite(11,HIGH);
  delay(100);
  digitalWrite(11,LOW);
  delay(100);
  digitalWrite(12,HIGH);
  delay(100);
  digitalWrite(12,LOW);
  delay(100);
  digitalWrite(13,HIGH);
  delay(100);
  digitalWrite(13,LOW);
  delay(100);
  }
  }


//if (incoming=="green ON"){
//  digitalWrite(13,HIGH);
//  }
//if (incoming=="green OFF"){
//  digitalWrite(13,LOW);
//  }
}
}
