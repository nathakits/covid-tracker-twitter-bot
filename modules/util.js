const fs = require('fs');
// parsing csv file to json obj
const time = require('./time')

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

const calcPercentageJSON = (obj, population) => {
  let vaccinated = obj.people_fully_vaccinated.replace(',', '')
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

// PDF to JSON
const replaceChars = (res) => {
  return new Promise(resolve => {
    let firstPass = res.text.replace(/จ ํานวน/g, 'จำนวน')
    let secondPass = firstPass.replace(/รําย/g, 'ราย')
    let thirdPass = secondPass.replace(/เวลํา/g, 'เวลา')
    let forthPass = thirdPass.replace(/เมษํายน/g, 'เมษายน')
    let fifthPass = forthPass.replace(/ขอมูล/g, 'ข้อมูล')
    let sixthPass = fifthPass.replace(/\n/g, '')
    // let stringify = JSON.stringify(sixthPass, null, 2)
    // fs.writeFileSync(`./data/pdf_res.json`, stringify)
    resolve(sixthPass)
  })
}

const matchAll = (text, array) => {
  return new Promise(resolve => {
    let arr = [{
      last_updated: time.currentDateTime,
      country: `Thailand`,
      vaccine: `Oxford/AstraZeneca, Sinovac`
    }]
    array.forEach(regex => {
      let found = text.match(regex)
      arr.push(found.groups)
      resolve(arr)
    })
  })
}

const formatDate = (array) => {
  return new Promise(resolve => {
    thai_month = {
      "มกราคม": "01",
      "กุมภาพันธ์": "02",
      "มีนาคม": "03",
      "เมษายน": "04",
      "พฤษภาคม": "05",
      "มิถุนายน": "06",
      "กรกฎาคม": "07",
      "สิงหาคม": "08",
      "กันยายน": "09",
      "ตุลาคม": "10",
      "พฤศจิกายน": "11",
      "ธันวาคม": "12",
    }
    let raw_date = array[1].date
    let arr = raw_date.split(' ')
    let date = parseInt(arr[0])
    let month = parseInt(arr[1])
    let year = parseInt(arr[2]) - 543
    // match and update the month to number
    for (const [key, value] of Object.entries(thai_month)) {
      let regex = new RegExp(key, 'g')
      let formatmonth = raw_date.match(regex)
      if (formatmonth) {
        month = value
        break;
      }
    }
    // create a new obj
    let fullDate = {
      date: `${date}-${month}-${year}`
    }
    // replace date obj with new formatted date obj
    array[1] = fullDate
    resolve(array)
  })
}

const cleanArray = (array) => {
  return new Promise(resolve => {
    let merged = Object.assign(...array)
    resolve(merged)
  })
}

const scrapePDF2JSON = async (res, regexArr) => {
  let text = await replaceChars(res)
  let matched = await matchAll(text, regexArr)
  let array = await formatDate(matched)
  let formattedJSON = await cleanArray(array)
  return formattedJSON
}

module.exports = {
  csvToJSON,
  getLatestRow2Json,
  calcPercentageCSV,
  calcPercentageJSON,
  drawProgressBar,
  scrapePDF2JSON,
  totalVaccinations,
}