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
let thread = [];

// read scraped vaccine json and tweet
const calcProgressBar = () => {
  // yesterday
  let percentage_ytd_1Dose = util.calcYesterdayPercentage(data.people_vaccinated, data.first_dose_plus, thailandPopulation)
  let percentage_ytd_2Dose = util.calcYesterdayPercentage(data.people_fully_vaccinated, data.second_dose_plus, thailandPopulation)
  // today
  let percentage1Dose = util.calcPercentageJSON(data.people_vaccinated, thailandPopulation)
  let percentage2Dose = util.calcPercentageJSON(data.people_fully_vaccinated, thailandPopulation)
  let progressbar1Dose = util.drawProgressBar(percentage1Dose, progressBarLength, barEmpty, barFull)
  let progressbar2Dose = util.drawProgressBar(percentage2Dose, progressBarLength, barEmpty, barFull)
  // diff
  let percentage1DosePlus = (percentage1Dose - percentage_ytd_1Dose).toFixed(2)
  let percentage2DosePlus = (percentage2Dose - percentage_ytd_2Dose).toFixed(2)
  // tweet sections
  let progressBar1 = `1st dose: ${percentage1Dose}% (+${percentage1DosePlus}%)\n${progressbar1Dose}`
  let progressBar2 = `\n\n2nd dose: ${percentage2Dose}% (+${percentage2DosePlus}%)\n${progressbar2Dose}`
  let progressNum1Dose = `\n\n1st dose: ${data.people_vaccinated} (+${data.first_dose_plus})`
  let progressNum2Dose = `\n2nd dose: ${data.people_fully_vaccinated} (+${data.second_dose_plus})`
  let progressNumTotal = `\nTotal: ${data.total_vaccinations} (+${data.total_dose_plus})`
  // combine all sections
  let progress = progressBar1 + progressBar2 + progressNum1Dose + progressNum2Dose + progressNumTotal
  // add to array
  thread.push(progress)
  console.log(thread);
  // tweet
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