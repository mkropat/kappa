'use strict';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var messages = [];

io.on('connection', function (socket) {
  console.log('a user connected');

  for (var i = 0; i < messages.length; i++) {
    socket.emit('chat message', messages[i]);
  }

  socket.on('chat message', function (msg) {
    console.log('message:', msg);
    messages.push(msg);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

let port = 5000;
http.listen(port, function(){
  console.log('listening on *:' + port);
});
