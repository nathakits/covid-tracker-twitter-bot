require('dotenv').config()
const { tweetThread } = require('./modules/tweet');

let randomNum = Math.floor(Math.random() * 101)
let thread = [`Hello World ${randomNum}`];

tweetThread(thread)
  .then(res => {
    console.log(`Successfully tweeted: ${res}`);
  })
  .catch(err => {
    let errors = err.errors
    console.log(errors);
    process.exit(1)
  });