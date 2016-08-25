(function () {
  'use strict';

  window.k.ChatController = class ChatController {
    constructor(socket, messageContainer, form) {
      this._socket = socket;
      this._messageContainer = messageContainer;
      this._form = form;
      this._input = form.querySelector('input');
    }

    init() {
      this._form.addEventListener('submit', e => {
        this._socket.emit('chat message', this._input.value);
        this._input.value = '';
        e.preventDefault();
      });

      this._socket.on('chat message', msg => {
        let li = document.createElement('li');
        li.textContent = msg;
        this._messageContainer.insertBefore(li, this._messageContainer.firstChild);
      });
    }
  };
})();
