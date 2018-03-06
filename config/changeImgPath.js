const url = require('url'),
      fs = require('fs')

/**
 * This will change images path if publish.
 *
 * @param {string} body Article body
 *
 */

module.exports = function(Articlebody) {
  const src = Articlebody.split(' ').filter(img => {
    const n = img.includes("src=");
    return n;
  });
  src.forEach(function(imgArr) {
  const regEx = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i,
    imgName = imgArr.match(regEx),
    urlParsetoDir = url.parse(imgName[0] || imgName[1], true),
    urlDir = "./public" + decodeURIComponent(urlParsetoDir.pathname),
    getImageName = urlPathname => {
      const decodedUrl = decodeURIComponent(urlPathname);
      const slice = decodedUrl.toString().slice(6, decodedUrl.length);
      return slice;
    };
  fs.renameSync(
    urlDir,
    "./public/uploads/" + getImageName(urlParsetoDir.pathname),
    err => {
      if (err) throw err;
    }
  );
});
};


