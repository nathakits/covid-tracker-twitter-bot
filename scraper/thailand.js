const fs = require('fs');
const crawler = require('crawler-request');
const csv = require('csv');
const parser = csv.parse();
const time = require('../modules/time')
const { scrapePDF2JSON } = require('../modules/util')
const axios = require('axios')
const { JSDOM } = require('jsdom')

// vars
let weburl = `https://ddc.moph.go.th/dcd/pagecontent.php?page=647&dept=dcd`
let regexArray = [
  /\วันที่ (?<date>.{1,30}) เวลา (?<time>.{1,10}) น. \)/,
  /วัคซีนสะสม (.{1,100}) ทั้งหมด (?<total_vaccinations>.{1,10}) โดส/,
  /วัคซีนเข็มที่ 1 (.{1,3})นวน (?<people_vaccinated>.{1,10}) ราย/,
  /รับวัคซีน 2 เข็ม\) (.{1,3})นวน (\W|.)(?<people_fully_vaccinated>.{1,10}) ราย/
]

const crawl = async () => {
  try {
    const { data } = await axios.get(weburl);
    const dom = new JSDOM(data, { resources: "usable" });
    const document = dom.window.document;
    const div = document.querySelector("#content-detail");
    let url = div.children[0].children[0].href
    let pdfURL = url.replace(/..\.pdf/g, `${time.date}.pdf`)
    crawler(pdfURL)
      .then(res => {
        scrapePDF2JSON(res, regexArray).then((data) => {
          data.source_url = pdfURL
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
  }
  catch (error) {
    console.error(error);
    process.exit(1)
  }
};

crawl()