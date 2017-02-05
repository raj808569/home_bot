var gpio= require("gpio");
var express= require('express');
var app=express();
var http= require('http').Server(app);
var io= require('socket.io')(http);
app.use(express.static(__dirname + '/public'));
var off1,off2;
var pyshell=require('python-shell');
var restify = require('restify');
var builder = require('botbuilder');
var light1status="OFF",light2status="OFF",fanstatus="OFF";
//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================
const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/988c74bb-30de-4ce6-819b-81d6d220e2ee?subscription-key=65f92c7df6514ac7a0e52a58bc2df493&verbose=true';

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });

//Default dialog
bot.dialog('/', intents);
intents.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

//Welcomemessage dialog
intents.matches('welcomemessage',[
	function(session){
		session.send("Hello User,I am your Home Automation Buddy.Type help for options.");
}]);

//Help dialog
intents.matches('help',[			
	function(session){
		session.send("Available options:-\n\n help \n\n allstatus--all devices \n\n turnlight1on \n\n turnlight1off \n\n turnlight2on \n\n turnlight2off \n\n fanon \n\n fanoff \n\n alllightson \n\n alllightsoff \n\n alldeviceson \n\n alldevicesoff");
}]);

//Turnlight1on
intents.matches('turnlight1on',[			
	function(session){
		pyshell.run('b.py',function(err){
						if(err) throw err;
					});
		light1status="ON";
		session.send("light1 turned on");
}]);

//Turnlight2on
intents.matches('turnlight2on',[			
	function(session){
pyshell.run('d.py',function(err){
						if(err) throw err;
					});
		light2status="ON";
		session.send("light2 turned on");
}]);

//Fanon
intents.matches('fanon',[			
	function(session){
pyshell.run('f.py',function(err){
						if(err) throw err;
					});
		fanstatus="ON";
		session.send("fan turned on");
}]);

//Turnlight1off
intents.matches('turnlight1off',[			
	function(session){
pyshell.run('a.py',function(err){
						if(err) throw err;
					});
		light1status="OFF";
		session.send("light1 turned off");
}]);

//Turnlight2off
intents.matches('turnlight2off',[			
	function(session){
pyshell.run('c.py',function(err){
						if(err) throw err;
					});
		light2status="OFF";
		session.send("light2 turned off");
}]);

//fanoff
intents.matches('fanoff',[			
	function(session){
pyshell.run('e.py',function(err){
						if(err) throw err;
					});
		fanstatus="OFF";
		session.send("fan turned off");
}]);

//allstatus
intents.matches('allstatus',[			
	function(session){
		session.send("Light1 is: "+light1status+"\n\n"+"Light2 is: "+light2status+"\n\n"+"Fan is: "+fanstatus);
}]);

//Alllightson
intents.matches('alllightson',[			
	function(session){
pyshell.run('b.py',function(err){
						if(err) throw err;
					});
pyshell.run('d.py',function(err){
						if(err) throw err;
					});
		light2status="ON";light1status="ON";
		session.send("light1 and 2 turned on");
}]);

//Alllightsoff
intents.matches('alllightsoff',[			
	function(session){
pyshell.run('a.py',function(err){
						if(err) throw err;
					});
pyshell.run('c.py',function(err){
						if(err) throw err;
					});
		light2status="OFF";light1status="OFF";
		session.send("light2 and 1 turned off");
}]);

//Alldeviceson
intents.matches('alldeviceson',[			
	function(session){
pyshell.run('b.py',function(err){
						if(err) throw err;
					});
pyshell.run('d.py',function(err){
						if(err) throw err;
					});
pyshell.run('f.py',function(err){
						if(err) throw err;
					});
		light2status="ON";light1status="ON";fanstatus="ON";
		session.send("all devices turned on");
}]);

//Alldevicesoff
intents.matches('alldevicesoff',[			
	function(session){
pyshell.run('a.py',function(err){
						if(err) throw err;
					});
pyshell.run('c.py',function(err){
						if(err) throw err;
					});
pyshell.run('e.py',function(err){
						if(err) throw err;
					});
		light2status="OFF";light1status="OFF";fanstatus="OFF";
		session.send("all devices turned off");
}]);
