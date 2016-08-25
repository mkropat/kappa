(function () {
  'use strict';

  window.k.imageLoader = {};

  window.k.imageLoader.load = function (url) {
    return new Promise((res, rej) => {
      let img = new Image();
      img.addEventListener('load', () => res(img));
      img.addEventListener('error', rej);
      img.src = url;
    });
  };
})();
