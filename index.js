var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)
const mongodb = require('mongodb').MongoClient
const path = require('path')
var uri = 'mongodb://'+process.env.MONGO_USER+':'+process.env.MONGO_PASS+'@ds239217.mlab.com:39217/nodejs'
var usernames = [];
var db;

server.listen(process.env.PORT || 5000);

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res){
           res.sendFile(__dirname + '/views/pages/index.html');
});

app.get('/dashboard', function(req, res){
         res.sendFile(__dirname + '/views/pages/dashboard.html');       
});


mongodb.connect(uri, function(err, client) {
	db = client.db('nodejs');
}); 
	
io.sockets.on( 'connection' , function(socket){
   
   socket.on( 'new user' , function(data){
         socket.username = data;
	 usernames.push(socket.username);
         updateUsernames();

   });
   
   //Update Usernames
   function updateUsernames(){
		io.sockets.emit('usernames', usernames );
   }
   
   //Send Message
   socket.on('send message',function(data){
	io.sockets.emit('new message',{msg:data,user:socket.username});
   });
   
   
   //Disconnect
   socket.on('disconnect',function(data){
	 if(!socket.username)return;
	 usernames.splice(usernames.indexOf(socket.username),1);
	 updateUsernames();
   });
   
   

});







