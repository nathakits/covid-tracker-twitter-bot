const fs = require('fs');
const { currentDateTime, formatDate } = require('./time')

let delta = 5

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
  let percentage = `${((vaccinated / population) * 100).toFixed(2)}`
  return percentage
}

const calcPercentageJSON = (num, population) => {
  let vaccinated = num.replace(/\s|,/g, '')
  let percentage = `${((vaccinated / population) * 100).toFixed(2)}`
  let parseNum = parseFloat(percentage)
  if (!isNaN(parseNum) && parseNum !== undefined) {
    return percentage
  } else {
    console.log(`Error calculating percentage`);
    process.exit(1)
  }
}

const calcYesterdayPercentage = (num, plus, population) => {
  let vaccinated = num.replace(/\s|,/g, '')
  let vaccinated_plus = plus.replace(/\s|,/g, '')
  let percentage = `${(( (vaccinated - vaccinated_plus) / population) * 100).toFixed(2)}`
  let parseNum = parseFloat(percentage)
  if (!isNaN(parseNum) && parseNum !== undefined) {
    return percentage
  } else {
    console.log(`Error calculating percentage`);
    process.exit(1)
  }
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
    let sixthPass = fifthPass.replace(/พฤษภําคม/g, 'พฤษภาคม')
    let seventhPass = sixthPass.replace(/\n/g, '')
    let eighthPass = seventhPass.replace(/ได/g, 'ได้')
    let ninthPass = eighthPass.replace(/จ านวน/g, 'จำนวน')
    let tenthPass = ninthPass.replace(/ตําม/g, 'ตาม')
    let eleventhPass = tenthPass.replace(/มิถุนํายน/g, 'มิถุนายน')
    let twelfthPass = eleventhPass.replace(/กรกฎําคม/g, 'กรกฎาคม')
    // let stringify = JSON.stringify(twelfthPass, null, 2)
    // fs.writeFileSync(`./data/pdf_res.json`, stringify)
    resolve(twelfthPass)
  })
}

const matchAll = (text, array) => {
  return new Promise(resolve => {
    let arr = [{
      last_updated: currentDateTime,
      country: `Thailand`,
      vaccines: [`Oxford/AstraZeneca`, `Sinovac`, `Sinopharm`]
    }]
    let matched = []
    array.forEach(regex => {
      let found = text.match(regex)
      let cleanObj = { ...found.groups }
      // remove whitespaces from matching regex
      if (!cleanObj.date) {
        Object.keys(cleanObj).forEach((val) => {
          cleanObj[val] = cleanObj[val].replace(/\s/g, "")
        });
      }
      console.log(cleanObj);
      matched.push(cleanObj)
    })
    Object.assign(arr[0], ...matched)
    resolve(arr)
  })
}

const formatThaiDate = (array) => {
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
    let raw_date = array[0].date
    if (raw_date) {
      let arr = raw_date.split(' ')
      let date = parseInt(arr[0])
      let month = parseInt(arr[1])
      let year = parseInt(arr[2]) - 543
      // match and update the month to number
      for (const [key, value] of Object.entries(thai_month)) {
        let regex = new RegExp(key, 'g')
        let formatmonth = raw_date.match(regex)
        if (formatmonth !== null) {
          if (value !== NaN) {
            month = value
            break;
          } else {
            console.log(`Error: formatting month ${value}`);
            process.exit(1)
          }
        }
      }
      
      // create a new obj
      let fullDate = `${formatDate(date)}-${month}-${year}`
      // replace date obj with new formatted date obj
      array[0].date = fullDate
    }
    resolve(array)
  })
}

const cleanArray = (array) => {
  return new Promise(resolve => {
    let merged = Object.assign(...array)
    resolve(merged)
  })
}

const sinovacArray = (obj) => {
  return new Promise(resolve => {
    obj.sinovac = []
    obj.sinovac.push({todayPlus: obj.sinoToday}, {totalDoses: obj.sinoTotal})
    delete obj.sinoToday
    delete obj.sinoTotal
    resolve(obj)
  })
}

// TODO: update this
// alotted vaccines
const calcVaccinesLeft = (obj) => {
  return new Promise(resolve => {
    let totalDoses = obj.total_doses.replace(/\s|,/g, "")
    let totalVaccinations = obj.total_vaccinations.replace(/\s|,/g, "")
    let dosesLeft = parseInt(totalDoses) - parseInt(totalVaccinations)
    obj.vaccines_left = dosesLeft.toLocaleString()
    resolve(obj)
  })
}

const scrapePDF2JSON = async (res, regexArr) => {
  let text = await replaceChars(res)
  let matched = await matchAll(text, regexArr)
  let array = await formatThaiDate(matched)
  let formattedJSON = await cleanArray(array)
  // let calcJSON = await calcVaccinesLeft(formattedJSON)
  return formattedJSON
}

module.exports = {
  csvToJSON,
  getLatestRow2Json,
  calcPercentageCSV,
  calcPercentageJSON,
  drawProgressBar,
  scrapePDF2JSON,
  calcYesterdayPercentage
}
