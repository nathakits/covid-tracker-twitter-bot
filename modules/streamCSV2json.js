

const fs = require('fs');
const request = require('request')
const csv = require('csvtojson')
const filePath = "https://raw.githubusercontent.com/wiki/djay/covidthailand/vac_timeline.csv"

const genJSON = async () => {
  const data = await csv().fromStream(request.get(filePath))
  let stringify = JSON.stringify(data)
  fs.writeFile('data/vac_timeline.json', stringify, (err) => {
    if (err) throw err
    console.log(`Status: Complete`);
  });
}

genJSON()