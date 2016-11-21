//Required Modules
var SerialPort = require("serialport");
var express = require('express');
var path = require('path');
var app = express();
var idData;

//Set up the Serial Port
var port = new SerialPort("/dev/tty.usbmodem1411", { //ttyACM0
  baudRate: 115200,
  parser: SerialPort.parsers.readline("\n")
});

//Setup the Server
// Define the port to run on
app.set('port', 8080);

app.use(express.static(path.join(__dirname, 'public')));

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});

var connections = new Array;            // list of connections to the server

var io = require('socket.io')(server);


//MongDB Stuff
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';
var datetime = new Date();
console.log(datetime);
var list;

var updateRecord = function(db,callback) {
  db.collection('people').update( 
  { id: ID },
   {
     $inc: { plays: 1 },
     $set: {
       favColor: "black",
     }
   } , function(err, result) {
  assert.equal(err,null);
  console.log("Updated the record.");
});

}

//container for our Person ID
var insertDocument = function(db, callback) {
   db.collection('people').insertOne( {
      "person1" : {
         "name" : "Dana",
         "djName" : "D$",
         "favGenre" : "ChipTunes",
         "tagline" : "p4wning n00bs since 1987",
         "id" : 1,
         "plays": 0
      },
       "person2" : {
         "name" : "Jason",
         "djName" : "Brad Wilczek",
         "favGenre" : "Detroit Techno",
         "tagline" : "I want to believe...",
         "id" : 2,
         "plays": 0
      },
       "person3" : {
         "name" : "Miyeon",
         "djName" : "DJ Link Link",
         "favGenre" : "Heavy metal",
         "tagline" : "YOLO!",
         "id" : 3,
         "plays": 0

      },
       "person4" : {
         "name" : "Aditi",
         "djName" : "OffKey",
         "favGenre" : "Rock",
         "tagline" : "Never without coffee.",
         "id" : 4,
         "plays": 0
      },
   }, function(err, result) {
    assert.equal(err, null);
	console.log("Loaded the baller DJs into the people collection.");
    callback();
  });

}
// find all documents in a collection
var findPeople = function(db, callback) {
   var cursor = db.collection('people').find( );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
         list = doc;
         console.log("The name is: " + list.name);
      } else {
         callback();
      }
   });
};


//Setup web socket
var io = require('socket.io')(server);


//Serial Function Calls

port.on('open', showPortIsOpen);
port.on('data', sendSerialData);
port.on('close', showPortIsClosed);
port.on('error', showError);

//Serial Functions

function showPortIsOpen() {
  console.log('The port is open. Data rate: ' + port.options.baudRate);
  MongoClient.connect(url, function(err,db) {
	assert.equal(null, err);
	insertDocument(db, function() {
	db.close();
});

});

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  findPeople(db, function() {
  	console.log("We found the person: " + list.person1.name + list.person2.name + list.person3.name + list.person4.name);
      db.close();
  });
});

}

function sendSerialData(data) {
console.log(data);
console.log("the data to send is" + data);
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

// function sendToSerial(data) {
//   console.log("sending to serial: " + data);
//   port.write(data);
// }

// function sendPeople(list) {
// 	console.log(list);
// 	if (connections.length > 0) {
// 		broadcast2(list);
// }
// socket.emit('peopleSent');

// }


function updateRecord(data) {
idData = data;
console.log(data);


// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   updateRecord(db, function() {
//     let ID = data;
//       db.close();
//   });
// });

};



//Web Socket Stuff
// ------------------------ webSocket Server event functions
io.on('connection', handleConnection);


function handleConnection(socket) {
  console.log("New Connection");
  socket.emit('hello', {list});
  // you have a new client
  connections.push(socket);             // add this client to the connections array

  // socket.on('getPeople', sendPeople);

  socket.on('recordUpdate', updateRecord);      // when a client sends a message,

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

//Send Database Data
function broadcast2(DBdata) {
	for (c in connections) {
		connections[c].send(DBdata);
	}
}

