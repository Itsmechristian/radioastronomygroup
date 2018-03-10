/** 
 * 
 * @param article article body change its path
 * 
*/
const url = require('url'),
      fs = require('fs')

module.exports = (article) => {
  const arrayBody = article.body.split(" ")

  const bodySrc = arrayBody.filter(src => src.includes("src="))


  const bagImages = bodySrc.filter(element => {
    // Change Regular expression before image deploy
    // /https?://domain/g
    const regEx = /(192.168|localhost).*:8000/i
    let imageName = element.match(regEx)
    return imageName !== null
  });

  bagImages.forEach(e => {
    const regEx = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i
    let imageName = e.match(regEx),
    urlParsetoDir = url.parse(imageName[0] || imageName[1], true),
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

  function getSpecificIndex(arrayBody, bagImages) {
    return bagImages.map(e => {
      return arrayBody.indexOf(e);
    });
  }
  function changeStringPath(imagesUrl) {
    return imagesUrl.map(e => {
      return e.toString().replace("temp", "uploads");
    });
  }
  let transferredUrl = changeStringPath(bodySrc);
  let indexOfImg = getSpecificIndex(arrayBody, bodySrc);

  for (let i = 0; i < transferredUrl.length; i++) {
    arrayBody.splice(indexOfImg[i], 1, transferredUrl[i]);
  }

  return arrayBody.join(' ')

}