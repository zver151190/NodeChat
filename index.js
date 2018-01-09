var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)
const mongodb = require('mongodb').MongoClient
const path = require('path')
var uri = 'mongodb://'+process.env.MONGO_USER+':'+process.env.MONGO_PASS+'@ds239217.mlab.com:39217/nodejs'
var clients = {};
var client_arr = [];
var result;
var isClient = false;

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
	
	
	
	
        io.on('connection', function(socket){
			
			clients[socket.id] = socket;
			
		   //Send client to their rooms	
           socket.on('room', function(room) {
              socket.join(room);
           });
		   
		  //If client is not support we need to save his data for future use 
          if(isClient){
			  var online_client = {client_id:socket.id,username:result.username,email:result.email,user_id:result.user_id};
			  var clientExists = false;
		          var exists = false;
		          for(i = 0 ; i < client_arr.length ; i++ ){
			    if( client_arr[i] !== null && client_arr[i] !== undefined ){	  
				    if( client_arr[i].user_id == result.user_id ){
				       exists = true;
				    }
			    }
			  }
		  
		           if(exists){
		              console.log("client exists--"+result.username);
			      exists = false;
			   }else{
			       client_arr.push(online_client);
			   }
			  socket.to('dashboard').emit('onlineClient',online_client);
          }
          
          socket.emit('userInfo',result);

          socket.on('startUserChat', function (userId) { 
                const db = client.db('nodejs');
                db.collection("chat").find({user_id:userId}).toArray(function(err, result) {
                     socket.emit('renderChat',result); 
                });
            });
          
           socket.on('checkOnlineClients', function (data) {
                socket.emit('checkOnlineClients',client_arr); 
	   });
          
             socket.on('sendMessage', function (data) {
                    const db = client.db('nodejs');
                    var user_id = data.user_id;
                    var email = data.email;
                    var username = data.username;
                    var message = data.message;
                    var d = new Date();
                    var timestamp = d.getTime();
                    var update_obj = { user_id: user_id,creation_time:timestamp, username: username,email:email,message:message,type:"user" };
                    db.collection("chat").update( {user_id:user_id},{$push:{messages:{ user_id: user_id,creation_time:timestamp, username: username,email:email,message:message,type:"user" }}} );
                    socket.emit('sendMessageResponse',update_obj);
                    socket.to('dashboard').emit('clientSentMessage', update_obj);
              });
          
             socket.on('disconnect', function() {
                socket.to('dashboard').emit('offlineClient',online_client);
                delete clients[socket.id];    
		for(i = 0 ; i < client_arr.length ; i++ ){
			if( client_arr[i] !== null && client_arr[i] !== undefined ){
				if( client_arr[i].user_id == result.user_id ){
					client_arr.splice(i,1);
				}
			}
		}
             });
       });
	   
	   
	   
	   
}); 
server.listen(process.env.PORT || 5000);




