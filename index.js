require('dotenv').config()
const axios = require('axios').default;
const util = require('./modules/util');
const { tweetThread } = require('./modules/tweet');

// global vars
let csvData = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/country_data/Thailand.csv'
let thailandPopulation = 69.799 * 1000000
let barEmpty = '░'
let barFull = '▒'
let progressBarLength = 20
let progressPercent = ''
let thread = [];

// get github csv and draw progress bar
axios({
  method: 'get',
  url: csvData,
  responseType: 'json'
})
.then((response) => {
  let csv = response.data
  let result = util.getLatestRow2Json(csv)
  let percentage = util.calcPercentage(result, thailandPopulation)
  let progressbar = util.drawProgressBar(percentage, progressBarLength, barEmpty, barFull)
  progressPercent = `${progressbar} ${percentage}%`
  thread.push(progressPercent)
  console.log(thread);
  // post tweet
  tweetThread(thread)
    .then(() => {
      console.log(`Successfully tweeted`);
    }).catch(err => {
      let errors = err.errors
      console.log(errors);
      process.exit(1)
    });
});


