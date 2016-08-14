var imageContainer = document.getElementById('tile-image-container');
var list = document.getElementById('tile-list');

fetch('/tiles')
  .then(r => r.json())
  .then(tiles => {
    tiles.forEach(t => {
      var a = document.createElement('a');
      a.href = '/tiles/' + t;
      a.textContent = t;
      a.addEventListener('click', e => {
        while (imageContainer.firstChild)
          imageContainer.removeChild(imageContainer.firstChild);

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

          imageContainer.appendChild(canvas);
        });

        e.preventDefault();
      });

      var li = document.createElement('li');
      li.appendChild(a);

      list.appendChild(li);
    });
  });

function renderImage(ctx, imgTag, selectedBoxX, selectedBoxY) {
  ctx.clearRect(0, 0, imgTag.naturalWidth, imgTag.naturalHeight);
  ctx.drawImage(imgTag, 0, 0);

  for (var x = 0; x < imgTag.naturalWidth; x += 32)
    ctx.fillRect(x, 0, 1, imgTag.naturalHeight);

  for (var y = 0; y < imgTag.naturalHeight; y += 32)
    ctx.fillRect(0, y, imgTag.naturalWidth, 1);

  if (selectedBoxX !== undefined) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 128, 0.4)'
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
