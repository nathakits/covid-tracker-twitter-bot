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
    let _1Pass = res.text.replace(/จ ํานวน/g, 'จำนวน')
    let _2Pass = _1Pass.replace(/รําย/g, 'ราย')
    let _3Pass = _2Pass.replace(/เวลํา/g, 'เวลา')
    let _4Pass = _3Pass.replace(/เมษํายน/g, 'เมษายน')
    let _5Pas = _4Pass.replace(/ขอมูล/g, 'ข้อมูล')
    let _6Pass = _5Pas.replace(/พฤษภําคม/g, 'พฤษภาคม')
    let _7Pass = _6Pass.replace(/\n/g, '')
    let _8Pass = _7Pass.replace(/ได/g, 'ได้')
    let _9Pass = _8Pass.replace(/จ านวน/g, 'จำนวน')
    let _10Pass = _9Pass.replace(/ตําม/g, 'ตาม')
    let _11Pass = _10Pass.replace(/มิถุนํายน/g, 'มิถุนายน')
    let _12Pass = _11Pass.replace(/กรกฎําคม/g, 'กรกฎาคม')
    let _13Pass = _12Pass.replace(/สิงหําคม/g, 'สิงหาคม')
    // let stringify = JSON.stringify(_13Pass, null, 2)
    // fs.writeFileSync(`./data/pdf_res.json`, stringify)
    resolve(_13Pass)
  })
}

const matchAll = (text, array) => {
  return new Promise(resolve => {
    let arr = [{}]
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
        let monthMatch = raw_date.match(regex)
        if (monthMatch) {
          month = value
        }
      }

      const currentDate = new Date()
      const currentMonth = new Intl.DateTimeFormat('en-US', { month: '2-digit' }).format(currentDate)

      let fullDate = ""
      if (month === currentMonth) {
        fullDate = `${formatDate(date)}-${month}-${year}`
      } else {
        console.log(`Error: formatting month`);
        process.exit(1)
      }

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
const calcVaccineAlottment = (obj) => {
  return new Promise(resolve => {
    let totalDoses = obj.total_doses.replace(/\s|,/g, "")
    let totalVaccinations = obj.total_vaccinations.replace(/\s|,/g, "")
    let dosesLeft = parseInt(totalDoses) - parseInt(totalVaccinations)
    obj.vaccines_left = dosesLeft.toLocaleString()
    resolve(obj)
  })
}

const checkDuplicateData = (obj) => {
  return new Promise(resolve => {
    const data = require('../data/vaccinations.json');
    for (const prop in obj) {
      if ( obj[prop] === data[prop] ) {
        console.log(`Error: duplicate data`);
        console.log(`${prop} - ${obj[prop]}`)
        process.exit(1)
      } else {
        console.log("Check passed")
      }
    }
    resolve(obj)
  })
}

const combineData = (obj) => {
  return new Promise(resolve => {
    const additionalData = {
      last_updated: currentDateTime,
      country: `Thailand`,
      vaccines: [`Oxford/AstraZeneca`, `Sinovac`, `Sinopharm`, `Pfizer`]
    }
    const combinedObj = {
      ...additionalData,
      ...obj,
    }
    resolve(combinedObj)
  })
}

const scrapePDF2JSON = async (res, regexArr) => {
  const text = await replaceChars(res)
  const matched = await matchAll(text, regexArr)
  const array = await formatThaiDate(matched)
  const formattedJSON = await cleanArray(array)
  const checkData = await checkDuplicateData(formattedJSON)
  const json = await combineData(checkData)
  // let calcJSON = await calcVaccineAlottment(formattedJSON)
  return json
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
