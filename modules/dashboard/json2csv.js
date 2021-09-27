const fs = require('fs');
const json2csv = require('json2csv').parse;
const timeseriesjson = require('../../data/dashboard/national-vacmod-timeseries.json')

const write = async (fileName, data) => {
  let rows;
  rows = json2csv(data, { header: true, quote: '' });
  fs.writeFileSync(fileName, rows);
}

console.log(`Status: Complete`)

write('./data/dashboard/national-vacmod-timeseries.csv', timeseriesjson)