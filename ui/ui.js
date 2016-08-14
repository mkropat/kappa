(function() {
  'use strict';

  let gameKeys = ['w', 'a', 's', 'd'];

  window.UiController = class UiController {
    constructor(screen, statusDisplay) {
      this._screen = screen;
      this._statusDisplay = statusDisplay;

      this._ctx = screen.getContext('2d');

      this._pressedKeys = {};
      this._frameCountSecond = 0;
      this._frameCount = 0;

      this._cameraX = 0;
      this._cameraY = 0;
    }

    init() {
      this._screen.focus();

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

        console.log('tileX', Math.floor(absoluteX/32));
        console.log('tileY', Math.floor(absoluteY/32));
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
      this._drawGrid();

      this._ctx.save();
      this._ctx.fillStyle = 'rgb(200,0,0)';
      this._ctx.fillRect(this._screen.width/2-8, this._screen.height/2-8, 16, 16);
      this._ctx.restore();

      this._frameCount++;
      requestAnimationFrame(this._render.bind(this));
    }

    _drawGrid() {
      let originX = Math.floor(-1 * this._cameraX - this._screen.width/2);
      let originY = Math.floor(this._cameraY + this._screen.height/2);

      this._ctx.save();

      let x, y;

      for (x = originX%32; x < this._screen.width; x += 32)
        this._ctx.fillRect(x, 0, 1, this._screen.height);

      for (x = originX%128; x < this._screen.width; x += 128)
        this._ctx.fillRect(x - 1, 0, 3, this._screen.height);

      for (y = originY%32; y < this._screen.height; y += 32)
        this._ctx.fillRect(0, y, this._screen.width, 1);

      for (y = originY%128; y < this._screen.height; y += 128)
        this._ctx.fillRect(0, y-1, this._screen.width, 3);

      this._ctx.restore();
    }
  };
})();
