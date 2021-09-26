const fs = require('fs');
const jsonfile = require('../../data/dashboard/national-vaccination-timeseries.json')

const timeseries = jsonfile.map((data, i, array) => {
  let firstDoseDaily = ""
  let secondDoseDaily = ""
  let thirdDoseDaily = ""

  if (array[i - 1] !== undefined) {
    firstDoseDaily = array[i].first_dose - array[i - 1].first_dose
    secondDoseDaily = array[i].second_dose - array[i -1].second_dose
    thirdDoseDaily = array[i].third_dose - array[i -1].third_dose
  } else {
    firstDoseDaily = 0
    secondDoseDaily = 0
    thirdDoseDaily = 0
  }

  const map = {
    "date": data.date,
    "first_dose_cum": data.first_dose,
    "second_dose_cum": data.second_dose,
    "third_dose_cum": data.third_dose,
    "total_vaccinations_cum": data.total_doses,
    "first_dose_daily": firstDoseDaily,
    "second_dose_daily": secondDoseDaily,
    "third_dose_daily": thirdDoseDaily,
    "total_vaccinations_daily": data.daily_vaccinations,
    "data_anomaly": data.data_anomaly,
  }

  return map
})

const genTimeseries = async () => {
  let stringify = JSON.stringify(timeseries)
  fs.writeFile('data/dashboard/national-vacmod-timeseries.json', stringify, (err) => {
    if (err) throw err
    console.log(`Status: Update Complete`);
  });
}

genTimeseries()