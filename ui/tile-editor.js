(function () {
  'use strict';

  window.TileSelector = class TileSelector {
    constructor(list, container) {
      this._list = list;
      this._container = container;
    }

    init() {
      fetch('/tiles')
        .then(r => r.json())
        .then(tiles => {
          tiles.sort((l, r) => l.localeCompare(r, 'en', { sensitivity: 'base' }));
          tiles.forEach(t => {
            this._addTileLink('/tiles/' + t, t);
          })
        });
    }

    _addTileLink(url, title) {
      var a = document.createElement('a');
      a.href = url;
      a.textContent = title;
      a.addEventListener('click', this._containerClick.bind(this));

      var li = document.createElement('li');
      li.appendChild(a);

      this._list.appendChild(li);
    }

    _containerClick(e) {
      e.preventDefault();

      removeChildren(this._container);

      loadImage(e.target.href).then(img => {
        var canvas = document.createElement('canvas');
        canvas.height = img.naturalHeight;
        canvas.width = img.naturalWidth;

        var ctx = canvas.getContext('2d');
        renderImage(ctx, img);

        canvas.addEventListener('click', e => {
          var rect = canvas.getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;

          renderImage(ctx, img, Math.floor(x/32), Math.floor(y/32));
        });

        this._container.appendChild(canvas);
      });
    }
  };

  function removeChildren(node) {
    while (node.firstChild)
      node.removeChild(node.firstChild);
  }

  function renderImage(ctx, imgTag, selectedBoxX, selectedBoxY) {
    ctx.clearRect(0, 0, imgTag.naturalWidth, imgTag.naturalHeight);
    ctx.drawImage(imgTag, 0, 0);

    for (var x = 0; x < imgTag.naturalWidth; x += 32)
      ctx.fillRect(x, 0, 1, imgTag.naturalHeight);

    for (var y = 0; y < imgTag.naturalHeight; y += 32)
      ctx.fillRect(0, y, imgTag.naturalWidth, 1);

    if (selectedBoxX !== undefined) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 128, 0.4)';
      ctx.fillRect(32*selectedBoxX, 32*selectedBoxY, 32, 32);
      ctx.restore();
    }
  }

  function loadImage(url) {
    return new Promise((res, rej) => {
      var img = new Image();
      img.addEventListener('load', () => res(img));
      img.addEventListener('error', rej);
      img.src = url;
    });
  }
})();
