const fs = require('fs');
const path = require('path')
const csv = require('csvtojson')
const filePath = path.join(__dirname, '../data/Thailand.csv');
const genJSON = async () => {
  const data = await csv().fromFile(filePath)
  let stringify = JSON.stringify(data)
  fs.writeFile('data/Thailand.json', stringify, (err) => {
    if (err) throw err
    console.log(`Status: Complete`);
  });
}

genJSON()