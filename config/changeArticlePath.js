/**
 * This will change the images path in article body if publish.
 *
 * @param {string} body Article body
 *
 */
module.exports = Articlebody => {
  const arrayBody = Articlebody.body.split(" ");

  const hasImg = arrayBody.filter(img => img.includes("src="));

  function getSpecificIndex(arrayBody, imagesIndex) {
    return imagesIndex.map(e => {
      return arrayBody.indexOf(e);
    });
  }

  function changeStringPath(imagesUrl) {
    return imagesUrl.map(e => {
      return e.toString().replace("temp", "uploads");
    });
  }

  let transferredUrl = changeStringPath(hasImg);
  let indexOfImg = getSpecificIndex(arrayBody, hasImg);

  for (let i = 0; i < transferredUrl.length; i++) {
    arrayBody.splice(indexOfImg[i], 1, transferredUrl[i]);
  }

  return arrayBody.join(" ");
};
