var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)
const mongodb = require('mongodb').MongoClient
const path = require('path')
var uri = 'mongodb://'+process.env.MONGO_USER+':'+process.env.MONGO_PASS+'@ds239217.mlab.com:39217/nodejs'
var clients = {};



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

  io.on('connection', function(socket){
     console.log(' %s sockets connected', io.engine.clientsCount);
     socket.on('room', function(room) {
              //socket.join(room);
              clients[socket.id] = socket;
              console.log("connect---"+socket.id);
      });
          
      socket.on('disconnect', function() {
          console.log("disconnect---"+socket.id);
          delete clients[socket.id];
      });
  });



server.listen(process.env.PORT || 5000);





