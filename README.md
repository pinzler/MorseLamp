MorseLamp
=========

Communicate in Morse Code using Arduino, Twilio, node.js and a lamp.  SMS a phrase to a Twilio number and the lamp will "translate" it into morse code.  (Also, you will receive a SMS with the morse code, so you can follow along.)

The node.js server handles the SMS messages, the converstion to morse code, and then sends the code to the Arduino Ethernet that controls the lamp.

Demo video: http://www.youtube.com/watch?v=VhwSx_bzHZU

Hardware
--------

The Parts

1) [Arduino Ethernet](https://www.sparkfun.com/products/11229)

2) [PowerSwitch Tail II](https://www.sparkfun.com/products/10747)

3) [M/M Jumper Wires](https://www.sparkfun.com/products/8431)

4) [5V FTDI Cable](https://www.sparkfun.com/products/9718) (To upload the sketch and power the board.)

5) A lamp 

6) A very small flat-head screw driver

Step 1 - Plug a yellow cable into digital pin 7 and a black cable into GND – these are to connect your Arduino to the PowerSwitch. 

Step 2 - Plug the other end of the yellow cable into +in (pin 1) on the PowerSwitch and the other end of the black cable into -in (pin 2) on the PowerSwitch. (Then use the flat-head screwdriver to secure the cables in your PowerSwitch.)

Step 3 - Plug the lamp into the PowerSwitch and plug the PowerSwitch into an outlet.

Software
--------

The Parts

1) server.js - Runs a node.js server that handles the SMS communication via HTTP, morse code translation and transmition to the Arduino via TCP.

2) MorseLamp.ino - Arduino sktech that receives the morse code from the node server and outputs it via the lamp.  (You must replace the mac[] with the mac address on the bottom of your Arduino and serverName[] with the IP address or hostname of your node.js server.)

You will need to upload the sketch to your Arduino and then setup a node.js server (the only extra package you should need is node-static which you can get by 'npm install node-static'.)  Then create a Twilio number where the SMS Request URL is http://YOUR.NODE.JS.SERVER/sms.xml.

(I'm not going over how to setup your Arduino or node.js server here since there are plenty of other places online that can explain this in detail far better than I could.)  
