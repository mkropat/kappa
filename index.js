'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/ui', express.static('ui'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var messageHistorySize = 10;
var messages = [];

io.on('connection', function (socket) {
  console.log('a user connected');

  for (var i = 0; i < messages.length; i++) {
    socket.emit('chat message', messages[i]);
  }

  socket.on('chat message', function (msg) {
    console.log('message:', msg);
    messages.push(msg);
    if (messages.length > messageHistorySize)
      messages = messages.slice(messages.length - messageHistorySize);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

let port = 2501;
http.listen(port, function(){
  console.log('listening on *:' + port);
});
