(function () {
  'use strict';

  window.k.TileSelector = class TileSelector {
    constructor(list, container, imageLoader, gridSize) {
      this._list = list;
      this._container = container;
      this._imageLoader = imageLoader;
      this._gridSize = gridSize || 32;

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

      let start = this._selected.start;
      let end = this._selected.end || start;

      return {
        img: this._selected.img,
        x: Math.min(start.x, end.x)*this._gridSize,
        y: Math.min(start.y, end.y)*this._gridSize,
        width: (Math.abs(start.x - end.x) + 1)*this._gridSize,
        height: (Math.abs(start.y - end.y) + 1)*this._gridSize
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

      this._imageLoader.load(e.target.href).then(img => {
        let canvas = document.createElement('canvas');
        canvas.height = img.naturalHeight;
        canvas.width = img.naturalWidth;

        let ctx = canvas.getContext('2d');
        this._renderImage(ctx, img);

        canvas.addEventListener('mousedown', e => {
          e.preventDefault();

          this._container.classList.add('selecting');

          let rect = canvas.getBoundingClientRect();

          let x = e.clientX - rect.left;
          let y = e.clientY - rect.top;
          this._selected = {
            img: img.src,
            start: {
              x: Math.floor(x/this._gridSize),
              y: Math.floor(y/this._gridSize)
            }
          };

          this._renderImage(ctx, img);
        });

        canvas.addEventListener('mouseup', e => {
          this._container.classList.remove('selecting');

          let rect = canvas.getBoundingClientRect();

          let x = e.clientX - rect.left;
          let y = e.clientY - rect.top;

          if (this._selected) {
            this._selected.end = {
              x: Math.floor(x/this._gridSize),
              y: Math.floor(y/this._gridSize)
            };
          }

          this._renderImage(ctx, img);
        });

        this._container.appendChild(canvas);
      });
    }

    _renderImage(ctx, imgTag) {
      ctx.clearRect(0, 0, imgTag.naturalWidth, imgTag.naturalHeight);
      ctx.drawImage(imgTag, 0, 0);

      for (let x = 0; x < imgTag.naturalWidth; x += this._gridSize)
        ctx.fillRect(x, 0, 1, imgTag.naturalHeight);

      for (let y = 0; y < imgTag.naturalHeight; y += this._gridSize)
        ctx.fillRect(0, y, imgTag.naturalWidth, 1);

      let selectedRect = this.selected;
      if (selectedRect !== null) {
        ctx.save();

        ctx.fillStyle = 'rgba(0, 0, 128, 0.4)';
        ctx.fillRect(
          selectedRect.x,
          selectedRect.y,
          selectedRect.width,
          selectedRect.height);

        ctx.restore();
      }
    }
  };

  function removeChildren(node) {
    while (node.firstChild)
      node.removeChild(node.firstChild);
  }
})();
