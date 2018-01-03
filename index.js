const express = require('express')
const mongodb = require('mongodb').MongoClient
const path = require('path')
const http = require('http').Server(express);
const io = require('socket.io')(http)
var url = ' mongodb://admin:054398262@ds239217.mlab.com:39217/nodejs'
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .get('/', (req, res) => res.sendFile(__dirname + '/views/pages/index.html'))
  .get('/dashboard', (req, res) => res.sendFile(__dirname + '/views/pages/dashboard.html'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

mongodb.connect(url, function(err, client) {
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
