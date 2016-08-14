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
          ctx.drawImage(img, 0, 0);

          for (var x = 0; x < canvas.width; x += 32)
            ctx.fillRect(x, 0, 1, canvas.height);

          for (var y = 0; y < canvas.height; y += 32)
            ctx.fillRect(0, y, canvas.width, 1);

          imageContainer.appendChild(canvas);
        });

        e.preventDefault();
      });

      var li = document.createElement('li');
      li.appendChild(a);

      list.appendChild(li);
    });
  });

function loadImage(url) {
  return new Promise((res, rej) => {
    var img = new Image();
    img.addEventListener('load', () => res(img));
    img.addEventListener('error', rej);
    img.src = url;
  });
}
