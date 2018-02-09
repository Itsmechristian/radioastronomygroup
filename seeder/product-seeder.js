const Post = require('../models/post')
, mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/testOnlyDbs')
.then((result => console.log('Connected to mongoDB')))
.catch((error => console.log(`Error: ${error}`)))

var posts =
 [
new Post({
  _id: new mongoose.Types.ObjectId(),
  title: 'lorem ipsum dolor',
  body: 'Pariatur pig mollit occaecat excepteur, t-bone salami nisi sirloin reprehenderit.  Reprehenderit sausage filet mignon ex, est ball tip ipsum pork doner hamburger aute tenderloin tail culpa dolore.  Kevin ut buffalo jowl frankfurter sirloin leberkas eiusmod lorem capicola ullamco boudin short loin tri-tip meatloaf.',
  downloadPath: '/testonly'
}),
new Post({
  _id: new mongoose.Types.ObjectId(),
  title: 'trip steak cupim ball tip eu occaecat culpa turducken shank minim tail in ea.',
  body: 'Pork belly aute non ut.  In anim minim cupidatat short loin fatback quis.  Anim leberkas excepteur porchetta burgdoggen frankfurter, adipisicing turkey ex turducken shoulder lorem ball tip eiusmod.',
  imagePath: '/testProduction/only',
  downloadPath: '/fortestOnly'
}) ]


var done = 0
for(var i = 0; i < posts.length; i++) {
  posts[i].save(function(err, results) {
    done++
    if(done === posts.length) {
      exit()
    }
  })
} 
function exit() {
  mongoose.disconnect().then(result => console.log('Disconnected to mongoDB'))
}