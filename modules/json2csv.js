const fs = require('fs');
const json2csv = require('json2csv').parse;
const dailyJSON = require('../data/vaccinations.json')

// const fullJSON = require('../data/Thailand.json')
// const latest = fullJSON[fullJSON.length - 1]
// const totalVac = Number(latest.total_vaccinations) + Number(dailyJSON.total_dose_plus.replace(/,/g, ""))

const formatVaccines = (obj) => {
  const arr = obj.vaccines
  let vaccines = ""
  arr.forEach((el,i)=> {
    if (arr.length !== (i + 1) ) {
      console.log(el);
      vaccines += `${el}, `
    } else {
      vaccines += `${el}`
    }
  })
  return vaccines
}

data = new Array(dailyJSON).map(data => {
  const map = {
    "location": data.country,
    "date": data.date,
    "vaccines": `"${formatVaccines(dailyJSON)}"`,
    "source_url": `"${data.source_url}"`,
    "total_vaccinations": data.total_vaccinations.replace(/,/g, ""),
    "people_vaccinated": data.people_vaccinated.replace(/,/g, ""),
    "people_fully_vaccinated": data.people_fully_vaccinated.replace(/,/g, ""),
    "booster_vaccinated": data.booster_vaccinated.replace(/,/g, ""),
    "totalDosePlus": data.total_dose_plus.replace(/,/g, ""),
    "firstDosePlus": data.first_dose_plus.replace(/,/g, ""),
    "secondDosePlus": data.second_dose_plus.replace(/,/g, ""),
    "thirdDosePlus": data.third_dose_plus.replace(/,/g, "")
  }
  return map
})

const write = async (fileName, data) => {
  let rows;
  rows = json2csv(data, { header: false, quote: '' });
  console.log(data);
  console.log(rows);
  // let formattedRows = rows.replaceAll('""')
  fs.appendFileSync(fileName, rows);
  fs.appendFileSync(fileName, "\r\n");
}

write('data/Thailand.csv', data)
write('data/th-dailytotal-test.csv', data)
