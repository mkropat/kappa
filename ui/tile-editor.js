(function () {
  'use strict';

  window.TileSelector = class TileSelector {
    constructor(list, container) {
      this._list = list;
      this._container = container;

      this._selected = null;
    }

    init() {
      fetch('/tiles')
        .then(r => r.json())
        .then(tiles => {
          tiles.sort((l, r) => l.localeCompare(r, 'en', { sensitivity: 'base' }));
          tiles.forEach(t => {
            this._addTileLink('/tiles/' + t, t);
          });
        });
    }

    get selected() {
      if (!this._selected)
        return null;

      return {
        img: this._selected.img,
        x: this._selected.x*32,
        y: this._selected.y*32
      };
    }

    _addTileLink(url, title) {
      let a = document.createElement('a');
      a.href = url;
      a.textContent = title;
      a.addEventListener('click', this._containerClick.bind(this));

      let li = document.createElement('li');
      li.appendChild(a);

      this._list.appendChild(li);
    }

    _containerClick(e) {
      e.preventDefault();

      removeChildren(this._container);

      loadImage(e.target.href).then(img => {
        let canvas = document.createElement('canvas');
        canvas.height = img.naturalHeight;
        canvas.width = img.naturalWidth;

        let ctx = canvas.getContext('2d');
        this._renderImage(ctx, img);

        canvas.addEventListener('click', e => {
          let rect = canvas.getBoundingClientRect();

          let x = e.clientX - rect.left;
          let y = e.clientY - rect.top;
          this._selected = {
            img: img,
            x: Math.floor(x/32),
            y: Math.floor(y/32)
          };

          this._renderImage(ctx, img);
        });

        this._container.appendChild(canvas);
      });
    }

    _renderImage(ctx, imgTag) {
      ctx.clearRect(0, 0, imgTag.naturalWidth, imgTag.naturalHeight);
      ctx.drawImage(imgTag, 0, 0);

      for (let x = 0; x < imgTag.naturalWidth; x += 32)
        ctx.fillRect(x, 0, 1, imgTag.naturalHeight);

      for (let y = 0; y < imgTag.naturalHeight; y += 32)
        ctx.fillRect(0, y, imgTag.naturalWidth, 1);

      if (this._selected !== null) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 128, 0.4)';
        ctx.fillRect(32*this._selected.x, 32*this._selected.y, 32, 32);
        ctx.restore();
      }
    }
  };

  function removeChildren(node) {
    while (node.firstChild)
      node.removeChild(node.firstChild);
  }

  function loadImage(url) {
    return new Promise((res, rej) => {
      let img = new Image();
      img.addEventListener('load', () => res(img));
      img.addEventListener('error', rej);
      img.src = url;
    });
  }
})();
