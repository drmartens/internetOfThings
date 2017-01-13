//Based off tutorial from imap library on github by mscdex
//Used example fro https://github.com/mscdex/node-imap to start and modified
//Takes user input to select which email box to view, 1 - 5
//This code fetches the date, from, to, and headers from user selected range of emails


//what if i want to check other boxes???
//imap.openBox('[Gmail]/Sent Mail', true, cb);

//can use this to search for other boxes
//imap.getBoxes(function(err, boxes) {
 // if (err) throw err;
  //console.dir(boxes);
//});

// var message1 = "Pick a mailbox. 1: Sent, 2: Starred, 3: Important, 4: Drafts, 5:Inbox"
// var message2 = "Pick 1st number in the range of emails you want to see, 1 is newest."
// var message3 = "Pick 2nd number in range, this number - first is how many emails you will receive"


//Require the NPM Library "IMAP"
var Imap = require('imap')
var inspect = require('util').inspect;

//I want to prompt users, so need to include prompt library
var prompt = require('prompt');
var begin;
var end;
var chosenMailBox;
var boxNum;
prompt.start();

//here are some of my experiments
//Using a prompt here to have user select which box they want to check
//Then the range of emails (1 being latest, and second number how many they want to see)

function getPrompt () {
prompt.get(['pickMailBox1_5','beginningRange', 'endingRange'], function (err, result) {
	//log the results
	console.log('User input received:');
	console.log(' Beginning Range is: ' + result.beginningRange);
	console.log(' Ending Range is: ' + result.endingRange);
	
	chosenMailBox = result.pickMailBox1_5; //set up the chosen box to correspond to Gmail box

	if (chosenMailBox == 1) {
		boxNum = '[Gmail]/Sent Mail';
	}

	else if (chosenMailBox == 2) {
		boxNum = '[Gmail]/Starred';
	}

	else if (chosenMailBox == 3) {
		boxNum = '[Gmail]/Important';
	}

	else if (chosenMailBox == 4) {
		boxNum = '[Gmail]/Drafts';
	} 

	else if (chosenMailBox == 5) {
		boxNum = '[Gmail]/Important Emails';
	}

	else {
		boxNum = 'INBOX'; //if they fuck up default to inbox
	}

	console.log ( 'Mailbox chosen is: ' + boxNum); //log which box they chose

	begin = result.beginningRange; //set up variable to hold beginning rante num
	end = result.endingRange; //set up variable to hold ending range num
	imapObject.connect(); //move imap connect here so that it only runs after all prompts received

})
}

getPrompt(); // now run the prompt


//Set up an object to hold our information for mailbox. We will replace this with config file.
var imapObject = new Imap({
	user: 'd.rose.martens@gmail.com', 
	password: 'coconuts17', 
	host: 'imap.gmail.com',
	port: 993,
	tls: true //check what this is....
});


//set a function to open our inbox folder
function openMyInbox(cb){
	imapObject.openBox(boxNum, true, cb);
}

//open the inbox
imapObject.once('ready', function() {
	openMyInbox(function(err, box) { //either look for the box or an error
		if(err) throw err;

		//To correct for it getting the oldest mail, we need to subtract our begin & end numbers from the
		//total length of the inbox
		var f = imapObject.seq.fetch(parseInt(box.messages.total - begin) + ":" + parseInt(box.messages.total - end), {
			bodies: 'HEADER.FIELDS (FROM TO SUBECT DATE BODY)', //get these heders
			struct: true
		});
		f.on('message', function(msg, seqno) {
			console.log('Message #%d', seqno);
			var prefix = '(#' + seqno + ')';
			msg.on('body', function(stream, info) {
				var buffer = "";
				stream.on('data', function(chunk) {
					buffer += chunk.toString('utf8');
				});
				stream.once('end', function(){
					console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
				});
			});
			msg.once('attributes', function(attrs) {
				// console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
			});
			msg.once('end', function() {
				console.log(prefix + 'Finished');
			});
		});
		f.once('error', function(err) {
			console.log("Fetch error: " + err); //if doesn't work, log and say what error is
		});
		f.once('end', function(){
			console.log("Done fetching all your messages fool!"); //log this if it works
		});
	});
});

imapObject.once('error', function(err) { //define the error function
	console.log(err);
});

imapObject.once('end', function() {
	console.log('Connection ended'); // end the connection
});


