var server = require('http').createServer(app)
var io = require('socket.io').listen(server);

var clients = {};

io.sockets.on('connection', function (socket) {
  clients[socket.id] = socket;
  
  console.log('a user connected: ' + socket.id);
  socket.emit("test", "ping");
  
  socket.on('test', function (e) {
    console.log(e);
  });
  
  socket.on("disconnect",function(data){
    delete clients[socket.id];
  });
});
