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

        var img = document.createElement('img');
        img.src = e.target.href;
        imageContainer.appendChild(img);

        e.preventDefault();
      });

      var li = document.createElement('li');
      li.appendChild(a);

      list.appendChild(li);
    });
  });
