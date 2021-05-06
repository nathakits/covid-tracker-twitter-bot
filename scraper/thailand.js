const fs = require('fs');
const crawler = require('crawler-request');
const csv = require('csv');
const parser = csv.parse();
const time = require('../modules/time')
const { scrapePDF2JSON } = require('../modules/util')
const axios = require('axios')
const { JSDOM } = require('jsdom')

// vars
let weburl = `https://ddc.moph.go.th/dcd/pagecontent.php?page=688&dept=dcd`
let regexArray = [
  /Sinovac\s*.{3}วนวัคซีนทั้งหมดที่ได้จัดสรร\s*.{3}นวน\s*(?<sinovac>\s*\d.\d*.\d*)/,
  /AstraZeneca\s*.{3}นวนวัคซีนทั้งหมดที่ได้จัดสรร\s*.{3}นวน\s*(?<astrazeneca>\s*\d.\d*.\d*)/,
  /ารจัดสรรวัคซีนทั้งหมด\s*.{3}นวน\s*(?<total_doses>\d*.\d*.\d*)/,
  /\วันที่\s*(?<date>.{1,30})\s*เวลา\s*18.00\s*น.\s*\)/,
  /วัคซีนสะสม (.{1,100}) ทั้งหมด\s*(?<total_vaccinations>\d*.\d*.\d*)\s*โดส\s*ใน\s*77\s*จังหวัด/,
  /วัคซีนเข็มที่ 1 (.{1,3})นวน (?<people_vaccinated>.{1,10}) ราย/,
  /รับวัคซีน 2 เข็ม\)\s*.{3}นวน\s*(?<people_fully_vaccinated>\d*.\d*\S\d*)/
]

const crawl = async () => {
  try {
    const { data } = await axios.get(weburl);
    const dom = new JSDOM(data, { resources: "usable" });
    const document = dom.window.document;
    const div = document.querySelector("#content-detail");
    let url = div.children[0].children[0].href
    let matchDate = url.match(/2021-\d*.(?<date>\d*).+/)
    let pdfDate = matchDate.groups.date
    if (pdfDate === time.date) {
      console.log(`PDF date matched`);
      crawler(url)
        .then(res => {
          scrapePDF2JSON(res, regexArray).then((data) => {
            data.source_url = url
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
    } else {
      console.log(`PDF date mismatch`);
      process.exit(1)
    }
  }
  catch (error) {
    console.error(error);
    process.exit(1)
  }
};

crawl()
