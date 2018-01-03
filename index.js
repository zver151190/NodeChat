var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)
const mongodb = require('mongodb').MongoClient
const path = require('path')
var uri = 'mongodb://admin:0543982262@ds239217.mlab.com:39217/nodejs'
var global_socket;
app.use(express.static(path.join(__dirname, 'public')))
  
app.get('/', function(req, res){
         res.sendFile(__dirname + '/views/pages/index.html');
         io.on('connection', function(socket){
           var key = req.query.k;
           var username = req.query.username;
           var email = req.query.email;
           var user_id = req.query.user_id;
           var result = {username:username,email:email,user_id:user_id};
           socket.emit('userInfo',result);
          });            
});


mongodb.connect(uri, function(err, client) {
        io.once('connect', function(socket){
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
                    db.collection("chat").update( {user_id:user_id},{$push:{messages:{ user_id: user_id,creation_time:timestamp, username: username,email:email,message:message,type:"user" }}} );
                  });
          });   
});
server.listen(process.env.PORT || 5000);




