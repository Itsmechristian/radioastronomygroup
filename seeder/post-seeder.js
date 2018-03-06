const Article = require('../models/Article')
, mongoose = require('mongoose')

require('dotenv').config()

mongoose.connect(`${process.env.DB_HOST}/test1`)
.then((result => console.log('Connected to mongoDB')))
.catch((error => console.log(`Error: ${error}`)))

var posts =
 [
new Article({
  _id: new mongoose.Types.ObjectId(),
  title: 'lorem Prance along on top of the garden fence, annoy the neighbor\'s dog and make it bark run outside as soon as door open dolor',
  body: 'Scamper favor packaging over toy. Kitty kitty. Play time leave fur on owners clothes knock over christmas tree but jump five feet high and sideways when a shadow moves sun bathe. You are a captive audience while sitting on the toilet,',
  createdBy: 'America Alvarenga'
}),
new Article({
  _id: new mongoose.Types.ObjectId(),
  title: 'Eat all the power cords cereal boxes make for five star accommodation intently sniff hand',
  body: 'url up and sleep on the freshly laundered towels run outside as soon as door open for give me some of your food give me some of your food give me some of your food meh, i don\'t want it. Swat turds around the house friends are not food or hopped up on catnip chew the plant rub face on everything. ',
  createdBy: 'Phillis Sassman'
}),
new Article({
  _id: new mongoose.Types.ObjectId(),
  title: 'Eat all the power cords cereal boxes make for five star accommodation intently sniff hand',
  body: 'url up and sleep on the freshly laundered towels run outside as soon as door open for give me some of your food give me some of your food give me some of your food meh, i don\'t want it. Swat turds around the house friends are not food or hopped up on catnip chew the plant rub face on everything. ',
  createdBy: 'Joane Tuel'
}),
new Article({
  _id: new mongoose.Types.ObjectId(),
  title: 'Meow go back to sleep owner brings food and water tries to pet on head, so scratch get sprayed by water because bad cat scamper',
  body: 'Meow jump five feet high and sideways when a shadow moves but eat plants, meow, and throw up because i ate plants. Cats go for world domination lies down and plan steps for world domination. Stand in front of the computer screen attack feet sniff sniff missing until dinner time, ',
  createdBy: 'Phillis Sassman'
}),
new Article({
  _id: new mongoose.Types.ObjectId(),
  title: 'Catch mouse and gave it as a present push your water glass on the floor',
  body: 'Intrigued by the shower. Mark territory hit you unexpectedly but jump launch to pounce upon little yarn mouse, bare fangs at toy run hide in litter box until treats are fed, eat plants, meow, and throw up because i ate plants.',
  createdBy: 'Terry Mcgown'
}),
 ]


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