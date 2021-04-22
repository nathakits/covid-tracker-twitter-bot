const fs = require('fs');
const crawler = require('crawler-request');
const time = require('../modules/time')
const { scrapePDF } = require('../modules/util')

// vars
let pdfUrl = `https://ddc.moph.go.th/uploads/ckeditor2//files/Daily%20report%202021-04-${time.date}.pdf`
let regexArray = [
  /ผู้ที่ได้รับวัคซีนสะสม (.{1,100}) ทั้งหมด (?<totalVaccinations>.{1,10}) โดส/,
  /ผู้ได้รับวัคซีนเข็มที่ 1 (.{1,3})นวน (?<singleDose>.{1,10}) ราย/,
  /\(ได้รับวัคซีน 2 เข็ม\) (.{1,3})นวน (?<twoDoses>.{1,10}) ราย/
]

crawler(pdfUrl)
  .then(res => {
    scrapePDF(res, regexArray).then((data) => {
      let stringified = JSON.stringify(data, null, 2)
      console.log(stringified);
      fs.writeFileSync(`./data/vaccinations.json`, stringified)
    }).catch(err => {
      console.log(`Scrape error: PDF URL doesn't exist`);
      console.log(err);
      process.exit(1)
    })
  })
  .catch(err => {
    console.log(`Crawler error`)
    console.log(err);
    process.exit(1)
  });