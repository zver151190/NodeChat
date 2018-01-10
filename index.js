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
    	console.log("user connected");	
});

server.listen(process.env.PORT || 5000);




