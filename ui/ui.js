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

  let cameraX = 0;
  let cameraY = 0;

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

  canvas.addEventListener('click', e => {
    e.preventDefault();

    let canvas = e.target;
    let rect = canvas.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    let absoluteX = cameraX + x - canvas.width/2;
    let absoluteY = cameraY - y + canvas.height/2;

    console.log('tileX', Math.floor(absoluteX/32))
    console.log('tileY', Math.floor(absoluteY/32));
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
      xinfo.innerText = cameraX;
      yinfo.innerText = cameraY;
      fps.innerText = frameCount;

      frameCountSecond = currentSec;
      frameCount = 0;
    }

    let move = 1;

    if (pressedKeys.w)
      cameraY += move;
    if (pressedKeys.a)
      cameraX -= move;
    if (pressedKeys.s)
      cameraY -= move;
    if (pressedKeys.d)
      cameraX += move;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(cameraX, cameraY);

    ctx.save();
    ctx.fillStyle = 'rgb(200,0,0)';
    ctx.fillRect(canvas.width/2-8, canvas.height/2-8, 16, 16);
    ctx.restore();

    frameCount++;
    requestAnimationFrame(render);
  }

  render();
})();
