/**************************************************************************/
/*! 
    This example will attempt to connect to an ISO14443A
    card or tag and retrieve some basic information about it
    that can be used to determine what type of card it is.   
   
    Note that you need the baud rate to be 115200 because we need to print
    out the data and read from the card at the same time!

    To enable debug message, define DEBUG in PN532/PN532_debug.h
    
*/
/**************************************************************************/

#if 0
  #include <SPI.h>
  #include <PN532_SPI.h>
  #include "PN532.h"

  PN532_SPI pn532spi(SPI, 10);
  PN532 nfc(pn532spi);
#elif 0
  #include <PN532_HSU.h>
  #include <PN532.h>
      
  PN532_HSU pn532hsu(Serial);
  PN532 nfc(pn532hsu);
#else 
  #include <Wire.h>
  #include <PN532_I2C.h>
  #include <PN532.h>
  #include <NfcAdapter.h>
  
  PN532_I2C pn532i2c(Wire);
  PN532 nfc(pn532i2c);
#endif

  boolean danaHere = false;
  boolean claudeHere = false;
  boolean catyHere = false;
  boolean bunnyHere = false;
  byte serialChar = 0;
  int ledPin = 13;
  int speakerPin = 8;
  char notes[] = "gabygabyxzCDxzCDabywabywzCDEzCDEbywFCDEqywFGDEqi        azbC"; // a space represents a rest
int length = sizeof(notes); // the number of notes
int beats[] = { 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 2,3,3,16,};
int tempo = 75;

void playTone(int tone, int duration) {
  for (long i = 0; i < duration * 1000L; i += tone * 2) {
    digitalWrite(speakerPin, HIGH);
    delayMicroseconds(tone);
    digitalWrite(speakerPin, LOW);
    delayMicroseconds(tone);
  }
}

void playNote(char note, int duration) {
  char names[] = { 'c', 'd', 'e', 'f', 'g', 'x', 'a', 'z', 'b', 'C', 'y', 'D', 'w', 'E', 'F', 'q', 'G', 'i' };
  // c=C4, C = C5. These values have been tuned.
  int tones[] = { 1898, 1690, 1500, 1420, 1265, 1194, 1126, 1063, 1001, 947, 893, 843, 795, 749, 710, 668, 630, 594 };
   
  // play the tone corresponding to the note name
  for (int i = 0; i < 18; i++) {
    if (names[i] == note) {
      playTone(tones[i], duration);
    }
  }
}
void setup(void) {
  Serial.begin(115200);
  Serial.println("Hello!");
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, HIGH);
 
  nfc.begin();

  uint32_t versiondata = nfc.getFirmwareVersion();
  if (! versiondata) {
    Serial.print("Didn't find PN53x board");
    while (1); // halt
  }
  
  // Got ok data, print it out!
  Serial.print("Found chip PN5"); Serial.println((versiondata>>24) & 0xFF, HEX); 
  Serial.print("Firmware ver. "); Serial.print((versiondata>>16) & 0xFF, DEC); 
  Serial.print('.'); Serial.println((versiondata>>8) & 0xFF, DEC);
  
  // Set the max number of retry attempts to read from a card
  // This prevents us from waiting forever for a card, which is
  // the default behaviour of the PN532.
  nfc.setPassiveActivationRetries(0xFF);
  
  // configure board to read RFID tags
  nfc.SAMConfig();
    
  Serial.println("Waiting for an ISO14443A card");
}

void loop(void) {
  pinMode(speakerPin, OUTPUT);
  boolean success;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };  // Buffer to store the returned UID
  uint8_t uidLength;                        // Length of the UID (4 or 7 bytes depending on ISO14443A card type)
  
  // Wait for an ISO14443A type cards (Mifare, etc.).  When one is found
  // 'uid' will be populated with the UID, and uidLength will indicate
  // if the uid is 4 bytes (Mifare Classic) or 7 bytes (Mifare Ultralight)
  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, &uid[0], &uidLength);

 //Wait for a character on the serial port.
if(Serial.available() > 0) {
serialChar = Serial.read();
  if (serialChar == 'c') {
    Serial.print('c');
    for (int i = 0; i < length; i++) {
    if (notes[i] == ' ') {
      delay(beats[i] * tempo); // rest
    } else {
      playNote(notes[i], beats[i] * tempo);
    // pause between notes
    delay(tempo / 2); 
  } 
     }
     digitalWrite(ledPin, LOW);
  } else if (serialChar == 'b'){
    Serial.print('b');
    digitalWrite(ledPin, HIGH);
  }
}

  if (success) {
//    Serial.println("Found a card!");
//    Serial.print("UID Length: ");Serial.print(uidLength, DEC);Serial.println(" bytes");
//    Serial.print("UID Value: ");
//    for (uint8_t i=0; i < uidLength; i++) 
//    {
//    Serial.print(" 0x");  Serial.print(uid[i], DEC); 
//    String theID = uid[i];
      
//    }
//    Serial.println("");
    if (uid[1] == 1) {
//        Serial.println("Hi Dana!");
        danaHere = true;
        Serial.print("RFID1:");Serial.println(danaHere);
        tone(speakerPin, 1000, 500);
      } else if (uid[1] == 7) {
//        Serial.println("Hi Claude!");
        claudeHere = true;
        Serial.print("RFID2:");Serial.println(claudeHere);
        tone(speakerPin, 1000, 500);
      } else if (uid[1] == 13) {
//        Serial.println("Hi Bunny!");
        bunnyHere = true;
        Serial.print("RFID3:");Serial.println(bunnyHere);
        tone(speakerPin, 1000, 500);
      } else if (uid[1] == 19) {
//        Serial.println("Hi Caty!");
        catyHere = true;
        Serial.print("RFID4:");Serial.println(catyHere);
        tone(speakerPin, 1000, 500);
      }

    // Wait 1 second before continuing
 
  
    delay(1000);
  }
  else
  {
    // PN532 probably timed out waiting for a card
//    Serial.println("Timed out waiting for a card");
  }
  
}

