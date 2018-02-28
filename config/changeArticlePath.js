/**
 * This will change the images path in article body if publish.
 *  
* @param {string} body Article body
* 
*/
module.exports = (Articlebody) => {

  const arrayBody = Articlebody.body.split(' ')
      
  const hasImg = arrayBody.filter(img =>  img.includes('src='))
  
  function getSpecificIndex (arrayBody, imagesIndex) {
    return imagesIndex.map(e => {
      return arrayBody.indexOf(e)
    })
  }
  
  function changeStringPath(imagesUrl) {
    return imagesUrl.map(e => {
      return e.toString().replace('temp', 'uploads')
    })
  }
  
  let transferredUrl = changeStringPath(hasImg)
  let indexOfImg = getSpecificIndex(arrayBody, hasImg)
  
  for(let i = 0; i < transferredUrl.length; i++) {
    arrayBody.splice(indexOfImg[i], 1, transferredUrl[i])
  }

  return arrayBody.join(' ')

  
  const src = Articlebody.body.split(' ').filter((img) => {
    const n = img.includes('src=')
    return n
  })
  src.forEach(function(imgArr){
 const regEx = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i
    ,  imgName = imgArr.match(regEx)
    , urlParsetoDir = url.parse(imgName[0] || imgName[1], true)
    , urlDir = './public' + decodeURIComponent(urlParsetoDir.pathname)
    , getImageName = (urlPathname) => {
    const decodedUrl = decodeURIComponent(urlPathname)
    const slice = decodedUrl.toString().slice(6, decodedUrl.length)
    return slice
  }
  fs.renameSync(urlDir, './public/uploads/' + getImageName(urlParsetoDir.pathname), err => {
    if(err) throw err;
  })
})
}

// const getImages = (result) => {
//   const src = result.body.split(' ').filter((img) => {
//     const n = img.includes('src=')
//     return n
//   })
//   return src
// } 

// })

