const fs = require('fs');
const crawler = require('crawler-request');
const csv = require('csv');
const parser = csv.parse();
const time = require('../modules/time')
const { scrapePDF2JSON } = require('../modules/util')

// vars
let pdfUrl = `https://ddc.moph.go.th/uploads/ckeditor2//files/Daily%20report%202021-2021-${time.formattedMonth}-${time.date}.pdf`
let regexArray = [
  /\( ข้อมูล ณ วันที่ (?<date>.{1,30}) เวลา (?<time>.{1,10}) น. \)/,
  /ผู้ที่ได้รับวัคซีนสะสม (.{1,100}) ทั้งหมด (?<total_vaccinations>.{1,10}) โดส/,
  /ผู้ได้รับวัคซีนเข็มที่ 1 (.{1,3})นวน (?<people_vaccinated>.{1,10}) ราย/,
  /\(ได้รับวัคซีน 2 เข็ม\) (.{1,3})นวน (?<people_fully_vaccinated>.{1,10}) ราย/
]

crawler(pdfUrl)
  .then(res => {
    scrapePDF2JSON(res, regexArray).then((data) => {
      data.source_url = pdfUrl
      let stringified = JSON.stringify(data, null, 2)
      console.log(stringified);
      // write to json file
      fs.writeFileSync(`./data/vaccinations.json`, stringified)
      // update csv file TODO
      // fs.readFile('./data/Thailand.csv', (err, fileData) => {
      //   if (fileData) {
      //     let records = parser(fileData, {
      //       columns: true
      //     });
      //     console.log(records);
      //   }
      // })
    }).catch(err => {
      if (res.status === 404) {
        console.log(res);
      }
      console.error(err);
      process.exit(1)
    })
  })
