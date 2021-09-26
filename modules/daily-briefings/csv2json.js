const fs = require('fs');
const path = require('path')
const csv = require('csvtojson')
const rawData = path.join(__dirname, '../data/Thailand.csv');
const correctedData = path.join(__dirname, '../data/th-dailytotal-test.csv');
const genJSON = async (file, name) => {
  const data = await csv().fromFile(file)
  let stringify = JSON.stringify(data)
  fs.writeFile(`data/${name}.json`, stringify, (err) => {
    if (err) throw err
    console.log(`Status: Complete`);
  });
}

genJSON(rawData, 'Thailand')
genJSON(correctedData, 'th-dailytotal-test')