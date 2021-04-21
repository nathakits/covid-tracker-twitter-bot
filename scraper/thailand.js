const fs = require('fs');
const crawler = require('crawler-request');

// vars
let d = new Date()
let date = d.getDate()
let pdfUrl = `https://ddc.moph.go.th/uploads/ckeditor2//files/Daily%20report%202021-04-${date}.pdf`
let regexArray = [
  /ผู้ที่ได้รับวัคซีนสะสม (.{1,100}) ทั้งหมด (?<totalVaccinations>.{1,10}) โดส/,
  /ผู้ได้รับวัคซีนเข็มที่ 1 (.{1,3})นวน (?<singleDose>.{1,10}) ราย/,
  /\(ได้รับวัคซีน 2 เข็ม\) (.{1,3})นวน (?<twoDoses>.{1,10}) ราย/
]

const replaceChars = (res) => {
  return new Promise(resolve => {
    let firstPass = res.text.replace(/จ ํานวน/g, 'จำนวน')
    let secondPass = firstPass.replace(/รําย/g, 'ราย')
    resolve(secondPass)
  })
}

const matchAll = (text, array) => {
  return new Promise(resolve => {
    let arr = [
      {date: d}
    ]
    array.forEach(regex => {
      let found = text.match(regex)
      arr.push(found.groups)
      resolve(arr)
    })
  })
}

const scrape = async (res) => {
  let text = await replaceChars(res)
  let matched = await matchAll(text, regexArray)
  return matched
}

crawler(pdfUrl)
  .then(res => {
    scrape(res).then((data) => {
      let stringified = JSON.stringify(data, null, 2)
      fs.writeFileSync('./data/vaccinations.json', stringified)
    })
  })
  .catch(err => {
    console.log(err);
    process.exit(1)
  });
