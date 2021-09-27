require('dotenv').config()
const util = require('./modules/util');
const { tweetThread } = require('./modules/tweet');
const fullData = require('./data/dashboard/national-vacmod-timeseries.json');
const data = fullData[fullData.length - 1]
const { graph } = require('./modules/charts/banner-graph');

// population data from OWID
// https://github.com/owid/covid-19-data/blob/master/scripts/input/un/population_2020.csv
const thailandPopulation = 69799978
const barEmpty = '░'
const barFull = '▓'
const progressBarLength = 20

const checkDate = () => {
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const fullDate = `${year}-${month < 10 ? "0" + month : month}-${day}`
  return fullDate
}

const checkTotalSum = () => {
  const total = data.total_vaccinations_daily
  const first = data.first_dose_daily
  const second = data.second_dose_daily
  const third = data.third_dose_daily
  const sum = first + second + third
  if (total !== sum) {
    console.log(`Total Raw: ${total}`);
    console.log(`Total Sum: ${sum}`);
    console.log(`Anomaly Detected: Total doesn't add up`);
    return false
  } else {
    console.log(`Total Sum: Pass`);
    return true
  }
}

const date = new Date(data.date)
const day = date.getDate()
const month = date.getMonth() + 1
const year = date.getFullYear()
const fullDate = `${day}-${month < 10 ? "0" + month : month}-${year}`

// read scraped vaccine json and tweet
const calcProgressBar = () => {
  let thread = [];
  // today
  let percentage1Dose = util.calcPercentageJSON(data.first_dose_cum, thailandPopulation)
  let percentage2Dose = util.calcPercentageJSON(data.second_dose_cum, thailandPopulation)
  let progressbar1Dose = util.drawProgressBar(percentage1Dose, progressBarLength, barEmpty, barFull)
  let progressbar2Dose = util.drawProgressBar(percentage2Dose, progressBarLength, barEmpty, barFull)
  // diff
  let percentage1DoseDaily = util.calcPercentageJSON(data.first_dose_daily, thailandPopulation)
  let percentage2DoseDaily = util.calcPercentageJSON(data.second_dose_daily, thailandPopulation)
  // tweet sections
  let progressBar1 = `1st dose: ${percentage1Dose}% (+${percentage1DoseDaily}%)\n${progressbar1Dose}`
  let progressBar2 = `\n\n2nd dose: ${percentage2Dose}% (+${percentage2DoseDaily}%)\n${progressbar2Dose}`
  let progressNum1Dose = `\n\n1st dose: ${data.first_dose_cum.toLocaleString()} (+${data.first_dose_daily.toLocaleString()})`
  let progressNum2Dose = `\n2nd dose: ${data.second_dose_cum.toLocaleString()} (+${data.second_dose_daily.toLocaleString()})`
  let progressNum3Dose = `\n3rd dose: ${data.third_dose_cum.toLocaleString()} (+${data.third_dose_daily.toLocaleString()})`
  let progressNumTotal = `\nTotal: ${data.total_vaccinations_cum.toLocaleString()} (+${data.total_vaccinations_daily.toLocaleString()})`
  let dateOfData = `\n\n${fullDate}`
  // combine all sections
  let progress = progressBar1 + progressBar2 + progressNum1Dose + progressNum2Dose + progressNum3Dose+ progressNumTotal + dateOfData
  // add to array
  thread.push(progress)
  console.log(thread);
  // post tweet and banner
  tweetThread(thread)
    .then(() => {
      console.log(`Successfully tweeted: Post`);
    }).catch(err => {
      let errors = err.errors
      console.log(errors);
      process.exit(1)
    });
  graph()
    .then(() => {
      console.log(`Successfully tweeted: Banner`);
    }).catch(err => {
      let errors = err.errors
      console.log(errors);
      process.exit(1)
    });
}

// check latest data with current day
if (checkDate() === data.date) {
  // check total sum
  if (checkTotalSum()) {
    calcProgressBar()
  } else {
    process.exit(1)
  }
} else {
  process.exit(1)
}