#include <SPI.h>
#include <Ethernet.h>

byte mac[] = {  0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };  // Fill in from the back of your Arduino
char serverName[] = "0.0.0.0"; //IP address for your node.js server.

int serverPort = 1337; //port for the node.js server
const int powerPin = 7; //pin connected to powerswitch

// Initialize the Ethernet client library
EthernetClient client;

void setup() {
  pinMode(powerPin, OUTPUT);
  digitalWrite(powerPin, LOW);

  Serial.begin(9600);

  // start the Ethernet connection:
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to configure Ethernet");
    // no point in carrying on, so do nothing forevermore:
    while(true);
  }
  // give the Ethernet shield a second to initialize:
  delay(1000);
  Serial.println("connecting...");

  // if you get a connection, report back via serial:

  if (client.connect(serverName, serverPort)) {
    Serial.println("connected");
    client.println("hello world");
  }
  else {
    // if you didn't get a connection to the server:
    Serial.println("connection failed");
  }
}

void loop()
{
  if (client.available()) {
    char c = client.read();
    Serial.print(c);

    if (c == '.') {
      digitalWrite(powerPin, HIGH);
      delay(500);
      digitalWrite(powerPin, LOW);
      delay(100);
    }
    else if (c == '-') {
      digitalWrite(powerPin, HIGH);
      delay(1500);
      digitalWrite(powerPin, LOW);
      delay(100);
  }
    else if (c == ' ') {
       delay(1000);
    }

  }

}
