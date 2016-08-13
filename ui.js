var canvas = document.getElementById('screen')
canvas.focus();

var ctx = canvas.getContext('2d');

var fps = document.getElementById('fps');
var xinfo = document.getElementById('x');
var yinfo = document.getElementById('y');

var pressedKeys = {};
var gameKeys = ['w', 'a', 's', 'd'];

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
  ctx.save();

  ctx.translate(originX%128, originY%128);

  for (var x = -128; x < canvas.width + 128; x += 32) {
    if (x % 128 !== 0)
      ctx.fillRect(x, -128, 1, canvas.height + 2*128);
  }
  for (var x = -1; x < canvas.width + 128; x += 128) {
    ctx.fillRect(x, -128, 3, canvas.height + 2*128);
  }

  for (var y = -128; y < canvas.height + 128; y += 32) {
    if (y % 128 !== 0)
      ctx.fillRect(-128, y, canvas.width + 2*128, 1);
  }
  for (var y = -1; y < canvas.height + 128; y += 128) {
    ctx.fillRect(-128, y, canvas.width + 2*128, 3);
  }

  ctx.restore();
}

var x = 0;
var y = 0;
var frameCountSecond = 0;
var frameCount = 0;
function render(timestamp) {
  var currentSec = Math.floor(timestamp/1000);
  if (currentSec !== frameCountSecond)
  {
    xinfo.innerText = x;
    yinfo.innerText = y;
    fps.innerText = frameCount;

    frameCountSecond = currentSec;
    frameCount = 0;
  }

  if (pressedKeys.w)
    y += 1;
  if (pressedKeys.a)
    x += 1;
  if (pressedKeys.s)
    y -= 1;
  if (pressedKeys.d)
    x -= 1;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid(x, y);

  frameCount++;
  requestAnimationFrame(render);
}

render();

ctx.save();
ctx.fillStyle = "rgb(200,0,0)";
ctx.fillRect (32, 32, 16, 16);
ctx.restore();

var map = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
