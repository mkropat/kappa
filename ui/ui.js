(function() {
  'use strict';

  let gridSize = 32;

  let gameKeys = ['w', 'a', 's', 'd'];

  window.k.UiController = class UiController {
    constructor(screen, statusDisplay, tileSelector, imageLoader, socket) {
      this._screen = screen;
      this._statusDisplay = statusDisplay;
      this._tileSelector = tileSelector;
      this._imageLoader = imageLoader;
      this._socket = socket;

      this._tiles = new Map();

      this._ctx = screen.getContext('2d');

      this._pressedKeys = {};
      this._frameCountSecond = 0;
      this._frameCount = 0;

      this._cameraX = 0;
      this._cameraY = 0;
    }

    init() {
      this._screen.focus();

      this._socket.on('set-tiles', newTiles => {
        Object.keys(newTiles).forEach(position => {
          this._imageLoader.load(newTiles[position].img).then(img => {
            newTiles[position].img = img;
            this._tiles[position] = newTiles[position];
          });
        });
      });

      this._screen.addEventListener('keydown', e => {
        if (gameKeys.indexOf(e.key) < 0)
          return;

        this._pressedKeys[e.key] = true;
        e.preventDefault();
      });

      this._screen.addEventListener('keyup', e => {
        if (gameKeys.indexOf(e.key) < 0)
          return;

        if (this._pressedKeys.hasOwnProperty(e.key))
          delete this._pressedKeys[e.key];

        e.preventDefault();
      });

      this._screen.addEventListener('click', e => {
        e.preventDefault();

        let canvas = e.target;
        let rect = canvas.getBoundingClientRect();

        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        let absoluteX = this._cameraX + x - canvas.width/2;
        let absoluteY = this._cameraY - y + canvas.height/2;

        let tile = this._tileSelector.selected;
        if (tile === null)
          return;

        let selectedGridX = Math.floor(absoluteX/gridSize);
        let selectedGridY = Math.floor(absoluteY/gridSize);

        this._imageLoader.load(tile.img).then(img => {
          let newTiles = new Map();

          for (let x = 0; x < tile.width/gridSize; x++) {
            for (let y = 0; y < tile.height/gridSize; y++) {
              let gridX = selectedGridX + x;
              let gridY = selectedGridY - y;

              newTiles[gridX + ',' + gridY] = {
                img: img.src,
                x: tile.x + x*gridSize,
                y: tile.y + y*gridSize
              };
            }
          }

          this._socket.emit('set-tiles', newTiles);
        });

      });

      this._render();
    }

    _render(timestamp) {
      let currentSec = Math.floor(timestamp/1000);
      if (currentSec !== this._frameCountSecond)
      {
        this._statusDisplay.render({
          fps: this._frameCount,
          cameraX: this._cameraX,
          cameraY: this._cameraY
        });

        this._frameCountSecond = currentSec;
        this._frameCount = 0;
      }

      let move = 1;

      if (this._pressedKeys.w)
        this._cameraY += move;
      if (this._pressedKeys.a)
        this._cameraX -= move;
      if (this._pressedKeys.s)
        this._cameraY -= move;
      if (this._pressedKeys.d)
        this._cameraX += move;

      this._ctx.clearRect(0, 0, this._screen.width, this._screen.height);
      this._drawTiles();
      this._drawGrid();

      this._ctx.save();
      this._ctx.fillStyle = 'rgb(200,0,0)';
      this._ctx.fillRect(this._screen.width/2-8, this._screen.height/2-8, 16, 16);
      this._ctx.restore();

      this._frameCount++;
      requestAnimationFrame(this._render.bind(this));
    }

    _drawGrid() {
      let bigGridSize = gridSize*4;
      let startX = Math.floor(-1*this._cameraX - this._screen.width/2) % bigGridSize;
      let startY = Math.floor(this._cameraY + this._screen.height/2) % bigGridSize;

      this._ctx.save();

      let x, y;

      for (x = startX%gridSize; x < this._screen.width; x += gridSize)
        this._ctx.fillRect(x, 0, 1, this._screen.height);

      for (x = startX; x < this._screen.width; x += bigGridSize)
        this._ctx.fillRect(x - 1, 0, 3, this._screen.height);

      for (y = startY%gridSize; y < this._screen.height; y += gridSize)
        this._ctx.fillRect(0, y, this._screen.width, 1);

      for (y = startY; y < this._screen.height; y += bigGridSize)
        this._ctx.fillRect(0, y-1, this._screen.width, 3);

      this._ctx.restore();
    }

    _drawTiles() {
      let absoluteStartX = this._cameraX - this._screen.width/2;
      let absoluteStartY = this._cameraY + this._screen.height/2;
      let gridStartX = Math.floor(absoluteStartX / gridSize);
      let gridStartY = Math.floor(absoluteStartY / gridSize);

      for (let y = gridStartY; y > gridStartY - (this._screen.height/gridSize + 1); y--) {
        for (let x = gridStartX; x < gridStartX + this._screen.width/gridSize + 1; x++) {
          let tile = this._tiles[x + ',' + y];
          if (tile) {
            this._ctx.drawImage(tile.img,
              tile.x, tile.y, gridSize, gridSize,
              (x - gridStartX)*gridSize - mod(absoluteStartX, gridSize),
              (gridStartY - y - 1)*gridSize + mod(absoluteStartY, gridSize),
              gridSize, gridSize);
          }
        }
      }
    }
  };

  function mod(x, m) {
    let r = x%m;
    return r < 0 ? r + m : r;
  }
})();
