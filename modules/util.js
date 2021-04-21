// parsing csv file to json obj
let delta = 5
let totalVaccinations = ''

const csvToJSON = (csv) => {
  var result = [];
  // split csv to lines
  var lines = csv.split("\n");
  // get headers
  var headers = lines[0].split(",");
  // remove empty rows
  var filtered = lines.filter(el => {
    return el !== '';
  });
  // loop
  for (var i = 1; i < filtered.length; i++) {
    var obj = {};
    // remove comma in vaccine manufacturer and remove ""
    let sanitized = filtered[i].replace('Oxford/AstraZeneca,', 'Oxford/AstraZeneca').replace(/"/g, '');
    // split into array
    var words = sanitized.split(",");
    // set objects
    for (var j = 0; j < words.length; j++) {
      obj[headers[j]] = words[j];
    }
    // push obj to array
    result.push(obj);
  }
  return result
}

const getLatestRow2Json = (csv) => {
  var result = [];
  var obj = {};
  // split csv to lines
  var lines = csv.split("\n");
  // get headers
  var headers = lines[0].split(",");
  // remove empty rows
  var filtered = lines.filter(el => {
    return el !== '';
  });
  // get only latest row
  let latest = filtered.pop()
  let sanitized = latest.replace('Oxford/AstraZeneca,', 'Oxford/AstraZeneca').replace(/"/g, '');
  var words = sanitized.split(",");
  // loop
  for (var j = 0; j < words.length; j++) {
    obj[headers[j]] = words[j];
  }
  result.push(obj);
  return result
}

const calcPercentageCSV = (array, population) => {
  let vaccinated = array[0].people_fully_vaccinated
  totalVaccinations = vaccinated
  let percentage = `${((vaccinated / population) * 100).toFixed(2)}`
  return percentage
}

const calcPercentageJSON = (array, population) => {
  let vaccinated = array[3].twoDoses.replace(',', '')
  let percentage = `${((vaccinated / population) * 100).toFixed(2)}`
  return percentage
}

const drawFullBars = (barStyle, num) => {
  var r = '';
  let deltaNum = (num / delta)
  if (num >= delta) {
    for (var j = 0; j < Math.floor(deltaNum); j++) r += barStyle;
  }
  return r;
}

const drawEmptyBars = (barStyle, num, fullbar) => {
  var r = '';
  for (var j = 0; j < (num - fullbar.length); j++) r += barStyle;
  r
  return r;
}

const drawProgressBar = (percentage, max, barEmpty, barFull) => {
  let bar = drawFullBars(barFull, percentage)
  let progressBar = bar + drawEmptyBars(barEmpty, max, bar)
  return progressBar
}

module.exports = {
  csvToJSON,
  getLatestRow2Json,
  calcPercentageCSV,
  calcPercentageJSON,
  drawProgressBar,
  totalVaccinations
}