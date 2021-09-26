require('dotenv').config()
const util = require('./util');
const data = require('../data/vaccinations.json');
const fullData = require('../data/Thailand.json');

// global vars
// population data from OWID
// https://github.com/owid/covid-19-data/blob/master/scripts/input/un/population_2020.csv
// 2021 population - 72,034,775
let thailandPopulation2020 = 69799978
let thailandPopulation2021 = 72034775
let barEmpty = '░'
let barFull = '▓'
let progressBarLength = 20

// check total doses
const prevData = fullData[fullData.length - 2]

const checkTotalDose = () => {
  const latest = data.total_dose_plus
  const latestTotal = Number(data.total_vaccinations.replace(/,/g, ""))
  const total = Number(prevData.total_vaccinations) + Number(latest.replace(/,/g, ""))
  if (total !== latestTotal) {
    console.log(`Added Total: ${total}`);
    console.log(`CCSA Total: ${latestTotal}`);
    console.log(`Anomaly Detected: Total doesn't add up`);
  } else {
    console.log(`Total Doses: Pass`);
  }
}

const checkFirstDose = () => {
  const latest = data.first_dose_plus
  const latestTotal = Number(data.people_vaccinated.replace(/,/g, ""))
  const total = Number(prevData.people_vaccinated) + Number(latest.replace(/,/g, ""))
  if (total !== latestTotal) {
    console.log(`Added First Dose: ${total}`);
    console.log(`CCSA Total: ${latestTotal}`);
    console.log(`Anomaly detected: First dose doesn't add up`);
  } else {
    console.log(`First doses: Pass`);
  }
}

const checkSecondDose = () => {
  const latest = data.second_dose_plus
  const latestTotal = Number(data.people_fully_vaccinated.replace(/,/g, ""))
  const total = Number(prevData.people_fully_vaccinated) + Number(latest.replace(/,/g, ""))
  if (total !== latestTotal) {
    console.log(`Added Second Dose: ${total}`);
    console.log(`CCSA Total: ${latestTotal}`);
    console.log(`Anomaly detected: Second dose doesn't add up`);
  } else {
    console.log(`Second doses: Pass`);
  }
}

const checkThirdDose = () => {
  const latest = data.third_dose_plus
  const latestTotal = Number(data.booster_vaccinated.replace(/,/g, ""))
  const total = Number(prevData.booster_vaccinated) + Number(latest.replace(/,/g, ""))
  if (total !== latestTotal) {
    console.log(`Added Third Dose: ${total}`);
    console.log(`CCSA Total: ${latestTotal}`);
    console.log(`Anomaly detected: Third dose doesn't add up`);
  } else {
    console.log(`Third doses: Pass`);
  }
}

const checkTotalSum = () => {
  const total = Number(data.total_dose_plus.replace(/,/g, ""))
  const first = Number(data.first_dose_plus.replace(/,/g, ""))
  const second = Number(data.second_dose_plus.replace(/,/g, ""))
  const third = Number(data.third_dose_plus.replace(/,/g, ""))
  const sum = first + second + third
  if (total !== sum) {
    console.log(`Total Raw: ${total}`);
    console.log(`Total Sum: ${sum}`);
    console.log(`Anomaly Detected: Total doesn't add up`);
  } else {
    console.log(`Total Sum: Pass`);
  }
}


// read scraped vaccine json and tweet
const calcProgressBar = (population, str) => {
  let thread = [];
  // yesterday
  let percentage_ytd_1Dose = util.calcYesterdayPercentage(data.people_vaccinated, data.first_dose_plus, population)
  let percentage_ytd_2Dose = util.calcYesterdayPercentage(data.people_fully_vaccinated, data.second_dose_plus, population)
  // today
  let percentage1Dose = util.calcPercentageJSON(data.people_vaccinated, population)
  let percentage2Dose = util.calcPercentageJSON(data.people_fully_vaccinated, population)
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
  let progressNum3Dose = `\n3rd dose: ${data.booster_vaccinated} (+${data.third_dose_plus})`
  let progressNumTotal = `\nTotal: ${data.total_vaccinations} (+${data.total_dose_plus})`
  let dateOfData = `\n\n${data.date}`
  // combine all sections
  let progress = progressBar1 + progressBar2 + progressNum1Dose + progressNum2Dose + progressNum3Dose+ progressNumTotal + dateOfData
  // add to array
  thread.push(progress)
  console.log(`----------------------------`);
  console.log(str);
  console.log(thread);
  // post tweet
}

checkTotalDose()
checkFirstDose()
checkSecondDose()
checkThirdDose()
checkTotalSum()
calcProgressBar(thailandPopulation2020, `2020 Population`)
// calcProgressBar(thailandPopulation2021, `2021 Population`)