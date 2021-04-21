require('dotenv').config()
const axios = require('axios').default;
const util = require('./modules/util');
const { tweetThread } = require('./modules/tweet');
const data = require('./data/vaccinations.json')

// global vars
let thailandPopulation = 69.799 * 1000000
let barEmpty = '░'
let barFull = '▒'
let progressBarLength = 20
let progressPercent = ''
let thread = [];

// read scraped vaccine json and tweet
const calcProgressBar = () => {
  let percentage = util.calcPercentageJSON(data, thailandPopulation)
  let progressbar = util.drawProgressBar(percentage, progressBarLength, barEmpty, barFull)
  progressPercent = `${progressbar} ${percentage}%`
  thread.push(progressPercent)
  tweetThread(thread)
    .then(() => {
      console.log(`Successfully tweeted`);
    }).catch(err => {
      let errors = err.errors
      console.log(errors);
      process.exit(1)
    });
}

calcProgressBar()