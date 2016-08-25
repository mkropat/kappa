'use strict';

var express = require('express');
var fs = require('fs');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/ui', express.static('ui'));
app.use('/tiles', express.static('tiles'));
app.use('/node_modules', express.static('node_modules'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/tiles', function (req, res) {
  fs.readdir('tiles', function (err, entries) {
    res.status(200)
      .json(entries);
  });
});

var messageHistorySize = 10;
var messages = [];

var tiles = new Map();

var layers = [];

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

  socket.emit('set-layers', layers);
  socket.on('set-layers', newLayers => {
    layers = newLayers;
    io.emit('set-layers', layers);
  });

  socket.emit('set-tiles', tiles);
  socket.on('set-tiles', newTiles => {
    Object.keys(newTiles).forEach(position => {
      tiles[position] = newTiles[position];
    });

    io.emit('set-tiles', newTiles);
  });

  socket.on('disconnect', function () { console.log('user disconnected'); }); });

let port = 2501;
http.listen(port, function(){
  console.log('listening on *:' + port);
});
