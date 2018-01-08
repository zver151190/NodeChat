var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)
const mongodb = require('mongodb').MongoClient
const path = require('path')
var uri = 'mongodb://admin:0543982262@ds239217.mlab.com:39217/nodejs'
var clients = {};
var client_arr = {};
var key;
var username;
var email;
var user_id;
var result;
var isClient = false;

app.use(express.static(path.join(__dirname, 'public')))
  
app.get('/', function(req, res){
         res.sendFile(__dirname + '/views/pages/index.html');
           key = req.query.k;
           username = req.query.username;
           email = req.query.email;
           isClient = true;
           user_id = req.query.user_id;
           result = {username:username,email:email,user_id:user_id};         
});

app.get('/dashboard', function(req, res){
         res.sendFile(__dirname + '/views/pages/dashboard.html');       
});


mongodb.connect(uri, function(err, client) {
        io.on('connection', function(socket){
                 clients[socket.id] = socket;
                 if(isClient){
                   var new_client = {client_id:socket.id,username:result.username,email:result.email,user_id:result.user_id};
                   socket.emit('dashboardStatus',new_client);
                 }
                 socket.emit('userInfo',result);

                  socket.on('startUserChat', function (userId) { 
                      const db = client.db('nodejs');
                      db.collection("chat").find({user_id:userId}).toArray(function(err, result) {
                        socket.emit('renderChat',result); 
                      });
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
                  });
          
                socket.on('disconnect', function() {
                    delete clients[socket.id];
                  });
          
          });   
});
server.listen(process.env.PORT || 5000);




