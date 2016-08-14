(function() {
  'use strict';

  let canvas = document.getElementById('screen');
  canvas.focus();

  let ctx = canvas.getContext('2d');

  let fps = document.getElementById('fps');
  let xinfo = document.getElementById('x');
  let yinfo = document.getElementById('y');

  let pressedKeys = {};
  let gameKeys = ['w', 'a', 's', 'd'];

  canvas.addEventListener('keydown', function (e) {
    if (gameKeys.indexOf(e.key) < 0)
      return;

    pressedKeys[e.key] = true;
    e.preventDefault();
  });

  canvas.addEventListener('keyup', function (e) {
    if (gameKeys.indexOf(e.key) < 0)
      return;

    if (pressedKeys.hasOwnProperty(e.key))
      delete pressedKeys[e.key];

    e.preventDefault();
  });

  function drawGrid(originX, originY) {
    originX = Math.floor(-1 * originX - canvas.width/2);
    originY = Math.floor(originY + canvas.height/2);

    ctx.save();

    let x, y;

    for (x = originX%32; x < canvas.width; x += 32)
      ctx.fillRect(x, 0, 1, canvas.height);

    for (x = originX%128; x < canvas.width; x += 128)
      ctx.fillRect(x - 1, 0, 3, canvas.height);

    for (y = originY%32; y < canvas.height; y += 32)
      ctx.fillRect(0, y, canvas.width, 1);

    for (y = originY%128; y < canvas.height; y += 128)
      ctx.fillRect(0, y-1, canvas.width, 3);

    ctx.restore();
  }

  let x = 0;
  let y = 0;
  let frameCountSecond = 0;
  let frameCount = 0;

  function render(timestamp) {
    let currentSec = Math.floor(timestamp/1000);
    if (currentSec !== frameCountSecond)
    {
      xinfo.innerText = x;
      yinfo.innerText = y;
      fps.innerText = frameCount;

      frameCountSecond = currentSec;
      frameCount = 0;
    }

    let move = 1;

    if (pressedKeys.w)
      y += move;
    if (pressedKeys.a)
      x -= move;
    if (pressedKeys.s)
      y -= move;
    if (pressedKeys.d)
      x += move;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(x, y);

    ctx.save();
    ctx.fillStyle = 'rgb(200,0,0)';
    ctx.fillRect(canvas.width/2-8, canvas.height/2-8, 16, 16);
    ctx.restore();

    frameCount++;
    requestAnimationFrame(render);
  }

  render();
})();
