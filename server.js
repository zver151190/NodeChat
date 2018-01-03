const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const path = require('path')
const io = require('socket.io')(http)
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


MongoClient.connect(url, function(err, client) {
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
