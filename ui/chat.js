var socket = io();
document.querySelector('form').addEventListener('submit', function (e) {
  socket.emit('chat message', document.getElementById('m').value);
  document.getElementById('m').value = '';
  e.preventDefault();
});

socket.on('chat message', function (msg) {
  var li = document.createElement('li');
  li.textContent = msg;
  var messages = document.getElementById('messages');
  messages.insertBefore(li, messages.firstChild);
});
