
//Library for Serial Port
var SerialPort = require("serialport");

// configure the webSocket server:
var connections = new Array;            // list of connections to the server
// var app = require('express')();
// var server = require('http').Server(app);

// server.listen(8080);

// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/index.html');
//   res.sendFile(__dirname + '/style.css');
// });

var express = require('express');
var path = require('path');
var app = express();

// Define the port to run on
app.set('port', 8080);

app.use(express.static(path.join(__dirname, 'public')));

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});

var io = require('socket.io')(server);



//Set up the Serial Port
var port = new SerialPort("/dev/ttyACM0", { //ttyACM0
  baudRate: 115200,
  parser: SerialPort.parsers.readline("\n")
});



//What Are We Doing? Part 1, Showing RFID on website

//Arduino
//1. Checks if an RFID is identified (4 diff RFID with unique values)
//2. If one of the RFID's is identified, change its boolean to True
//3. Serial.print the boolean value with tag so we can regex it?

//Javascript
//1. Listen to the Serial Command Line for the RFID values
//2. If one of the RFID value changes to true, update the corresponding RFID Variable to True
//3. Change the Text of the Div to Say it is Now True

port.on('open', showPortIsOpen);
port.on('data', sendSerialData);
port.on('close', showPortIsClosed);
port.on('error', showError);


//Global Variables
var results = [];
var sortedResults = [];
// var finalResults = [];

//Set Up Our Serial Communications, 4 Functions Needed
function showPortIsOpen() {
  console.log('The port is open. Data rate: ' + port.options.baudRate);
}

function sendSerialData(data) {
console.log(data);
  if (connections.length > 0) {
    broadcast(data);
  }  
}

function showPortIsClosed() {
  console.log('The port is closed.');
}

function showError(error) {
  console.log('Serial Port Error: ' + error);
}

function sendToSerial(data) {
  console.log("sending to serial: " + data);
  port.write(data);
}




// ------------------------ webSocket Server event functions
io.on('connection', handleConnection);


function handleConnection(socket) {
  console.log("New Connection");
  socket.emit('open', {hello: 'world'});
  // you have a new client
  connections.push(socket);             // add this client to the connections array

  socket.on('clientMessage', sendToSerial);      // when a client sends a message,

  socket.on('close', function() {           // when a client closes its connection
    console.log("connection closed");       // print it out
    var position = connections.indexOf(socket); // get the client's position in the array
    connections.splice(position, 1);        // and delete it from the array
  });
}
// This function broadcasts messages to all webSocket clients
function broadcast(data) {
  for (c in connections) {     // iterate over the array of connections
    connections[c].send(data); // send the data to each connection
  }
}


// function handleData () {
  
//   let reg = new RegExp('RFID[\\s\\S]', 'i'); 
//   for (item of results) {
//     // console.log(item);
//     if (reg.test(item)) {
//       finalResults.push(item);
//     }
//   }


// console.log(results);
// console.log(finalResults);
// }



// port.on('open', function() {

// port.on('data', function(data) {
// //console.log((data));
//     var res = data.split(",");
//     console.log(res[0]);
//     });

// // getinput();

// });





// router.get('/RFID/:rfidVal1/:rfidVal2/:rfidVal3/:rfidVal4', function(req, res) {
//   //build a javascript object to hold rfid boolean values
//   var rfidData = {
//     "rfidValues": {
//       "rfidVal1": req.params.rfidVal1,
//       "rfidVal2": req.params.rfidVal2,
//       "rfidVal3": req.params.rfidVal3,
//       "rfidVal4": req.params.rfidVal4
//     }
//   };




// }


// router.get('/LEDS/:xval/:yval/:zval', function (req, res) {
//   //javascript object
//   var data = {
//         "myvalues": {
//             "xval": req.params.xval,
//             "yval": req.params.yval,
//             "zval": req.params.zval
//         }
//     }; 

//    // led1.writeSync(parseInt(req.params.xval));
//    // led2.writeSync(parseInt(req.params.yval));
//    // led3.writeSync(parseInt(req.params.zval));
 
// led1.writeSync(button1);
// led2.writeSync(button2);
// led3.writeSync(button3);

//  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
//   console.log(data);
//   res.end("Values have been sent to server - x="+req.params.xval+" y="+req.params.yval+" z="+req.params.zval) 
// });

 
// var server = http.createServer(function(req, res) {
//   router(req, res, finalhandler(req, res))
// })
 
// server.listen(8000)
