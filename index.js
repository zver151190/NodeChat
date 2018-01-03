var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)
const mongodb = require('mongodb').MongoClient
const path = require('path')
var url = 'mongodb://admin:054398262@ds239217.mlab.com:39217/nodejs'

  app.use(express.static(path.join(__dirname, 'public')))
  app.get('/', (req, res) => res.sendFile(__dirname + '/views/pages/index.html'))
  app.get('/dashboard', (req, res) => res.sendFile(__dirname + '/views/pages/dashboard.html'))
  server.listen(process.env.PORT || 5000);

mongodb.connect(url, function(err, client) {
    console.log(err);
    console.log(client);
    io.on('connection', function(socket){
      socket.on('startUserChat', function (userId) {
        const db = client.db('nodejs');
        db.collection("chat").find({user_id:userId}).toArray(function(err, result) {
          socket.emit('renderChat',result); 
        });
      });
      socket.on('sendMessage', function (data) {
        const db = client.db('mongochat');
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
