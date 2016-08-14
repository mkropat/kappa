(function() {
  'use strict';

  window.StatusDisplay = class StatusDisplay {
    constructor(container) {
      this._ul = document.createElement('ul');
      container.appendChild(this._ul);

      this._keyToSpan = {};
    }

    render(items) {
      Object.keys(items).forEach(k => {
        if (!this._keyToSpan[k]) {
          let li = document.createElement('li');
          li.appendChild(document.createTextNode(k + ': '));

          this._keyToSpan[k] = document.createElement('span');
          li.appendChild(this._keyToSpan[k]);

          this._ul.appendChild(li);
        }

        this._keyToSpan[k].innerText = items[k];
      });
    }
  };
})();
