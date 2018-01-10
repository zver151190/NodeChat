var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)
const mongodb = require('mongodb').MongoClient
const path = require('path')
var uri = 'mongodb://'+process.env.MONGO_USER+':'+process.env.MONGO_PASS+'@ds239217.mlab.com:39217/nodejs'
var clients = {};
var client_id= [];
var client_arr = [];
var result;
var isClient = false;
var db;
app.use(express.static(path.join(__dirname, 'public')))
  
app.get('/', function(req, res){
         res.sendFile(__dirname + '/views/pages/index.html');
           var key = req.query.k;
           var username = req.query.username;
           var email = req.query.email;
           isClient = true;
           var user_id = req.query.user_id;
           result = {username:username,email:email,user_id:user_id};
});

app.get('/dashboard', function(req, res){
         res.sendFile(__dirname + '/views/pages/dashboard.html');       
});


mongodb.connect(uri, function(err, client) {
	db = client.db('nodejs');
}); 
	
io.on('connection', function(socket){
	
	if(isClient){
	  socket.emit("clientOnlineArray",client_arr);	
          var online_client = {client_id:socket.id,username:result.username,email:result.email,user_id:result.user_id};
	  var clientExists = false;
	  for( i = 0; i < client_arr.length ; i++ ){
		if(client_arr[i].user_id == result.user_id ){
			clientExists = true;
		}
	    }
	   if(!clientExists){
		console.log("add user to array");   
		client_arr.push(online_client);
	   }
	
		socket.user_id = result.user_id;
		console.log("user connected " + socket.user_id);

		socket.on('disconnect',function(){
			console.log("user disconnected " + socket.user_id);
			for( i = 0 ; i < client_arr.length ; i++ ){
			   if(client_arr[i].user_id == socket.user_id ){
				client_arr = client_arr.splice(i,1);
				   console.log("we have deleted him from array");
			    }
			}
		});
	}
});

server.listen(process.env.PORT || 5000);




