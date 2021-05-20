require('dotenv').config()
const util = require('./modules/util');
const { tweetThread } = require('./modules/tweet');
const data = require('./data/vaccinations.json')

// global vars
// population data from OWID
// https://github.com/owid/covid-19-data/blob/master/scripts/input/un/population_2020.csv
let thailandPopulation = 69799978
let barEmpty = '░'
let barFull = '▓'
let progressBarLength = 20
let progressPercent = ''
let thread = [];

// read scraped vaccine json and tweet
const calcProgressBar = () => {
  let percentage = util.calcPercentageJSON(data, thailandPopulation)
  let progressbar = util.drawProgressBar(percentage, progressBarLength, barEmpty, barFull)
  progressPercent = `${progressbar} ${percentage}%`
  thread.push(progressPercent)
  console.log(thread);
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
