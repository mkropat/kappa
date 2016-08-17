(function () {
  'use strict';

  window.imageLoader = {};

  window.imageLoader.load = function (url) {
    return new Promise((res, rej) => {
      let img = new Image();
      img.addEventListener('load', () => res(img));
      img.addEventListener('error', rej);
      img.src = url;
    });
  };
})();
