var sys = require('sys')
  , url = require('url')
  , net = require('net')
  , http = require('http')
  , querystring = require('querystring')
  , HTTPPORT = 81
  , TCPPORT = 1337
  , static = require('node-static')
  
  // Create a node-static server to serve the public directory
  , fileServer = new static.Server('./public', { cache: 7200, headers: {'X-Hello':'Andrew Pinzler'} });
  
var httpServer = http.createServer(function (request, response) {

  request.body = '';
  request.addListener('data', function(chunk){ request.body += chunk; });

  request.addListener('end', function () {

    var params = querystring.parse(url.parse(request.url).query);
    var posted = querystring.parse(request.body);
    for (var i in posted) {
      params[i] = posted[i];
    }
        
    // print only relevant debugging data
    var printme = ['From', 'Digits', 'CallStatus', 'CallDuration']
      , label;
    for (i in printme) {
      label = printme[i]
      if (params[label]) {
        sys.error(label + ': ' + JSON.stringify(params[label]));
      }
    }
    
    var path = url.parse(request.url).pathname;

    var mcode = '';

    switch(path) {
            
      case '/sms.xml':

          mcode = morse(params.Body);

          console.log('> '+ params.Body + ' ' + mcode);

          if (arduinoTcp !== null && tcpServer.connections > 0) 
          {
              arduinoTcp.write(mcode); //send the morse code to the Arduino
          }

          //Create TwiML response with the morse code translation dynamically 
          response.writeHead(200, {'Content-Type': 'text/xml'});
          response.write('<?xml version="1.0" encoding="UTF-8"?><Response><Sms>');
          response.write(mcode);
          response.write('</Sms></Response>');
          response.end();

        break; // end of case
      
      // Handling plain static content.
      default:
        fileServer.serve(request, response, function (err, res) {
          if (err) { // An error as occured
            sys.error('> Error serving ' + request.url + ' - ' + err.message);
            fileServer.serveFile('index.html', err.headers, err.headers, request, response);
          } else { // The file was served successfully
            console.log('> ' + request.url + ' - ' + res.message);
          }
        });
    }
  });
});


httpServer.listen(HTTPPORT);
console.log('> web server is running on port ' + HTTPPORT);

var arduinoTcp = null;

var tcpServer = net.createServer(function (socket) {
  console.log('tcp server running');
});

tcpServer.on('connection', function (socket) {
  console.log('num of connections on: ' + tcpServer.connections);
  arduinoTcp = socket;
  socket.on('data', function (mydata) {
  });
});
tcpServer.listen(TCPPORT);


//Translate text into morse code
function morse (text) {

    var charCodes = new Array(36);
    charCodes["a"]=".-";
    charCodes["b"]="-...";
    charCodes["c"]="-.-.";
    charCodes["d"]="-..";
    charCodes["e"]=".";
    charCodes["f"]="..-.";
    charCodes["g"]="--.";
    charCodes["h"]="....";
    charCodes["i"]="..";
    charCodes["j"]=".---";
    charCodes["k"]="-.-";
    charCodes["l"]=".-..";
    charCodes["m"]="--";
    charCodes["n"]="-.";
    charCodes["o"]="---";
    charCodes["p"]=".--.";
    charCodes["q"]="--.-";
    charCodes["r"]=".-.";
    charCodes["s"]="...";
    charCodes["t"]="-";
    charCodes["u"]="..-";
    charCodes["v"]="...-";
    charCodes["w"]=".--";
    charCodes["x"]="-..-";
    charCodes["y"]="-.--";
    charCodes["z"]="--..";
    charCodes["1"]=".----";
    charCodes["2"]="..---";
    charCodes["3"]="...--";
    charCodes["4"]="....-";
    charCodes["5"]=".....";
    charCodes["6"]="-....";
    charCodes["7"]="--...";
    charCodes["8"]="---..";
    charCodes["9"]="----.";
    charCodes["0"]="-----";
 
    var temp='';

    var chars=text.toLowerCase().split("");

    for (a=0; a<chars.length; a++) {
      if (chars[a]!=" ") {
        if (charCodes[chars[a]]) {
          temp+=charCodes[chars[a]]+" ";
        }
      }
    }
  return temp;
}
