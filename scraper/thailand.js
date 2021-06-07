const fs = require('fs');
const crawler = require('crawler-request');
const csv = require('csv');
const parser = csv.parse();
const time = require('../modules/time')
const { scrapePDF2JSON } = require('../modules/util')
const axios = require('axios')
const { JSDOM } = require('jsdom')

// vars
let weburl = `https://ddc.moph.go.th/dcd/pagecontent.php?page=708&dept=dcd`
let regexArray = [
  /Sinovac\s*\W*นวนวัคซีนทั้งหมดที่ได้จัดสรร\s*.\W*นวน\s*(?<sinovac>.{1,40})\s*โดส/,
  /AstraZeneca\s*\W*นวนวัคซีนทั้งหมดที่ได้จัดสรร\s*\W*นวน\s*(?<astrazeneca>.{1,40})\s*โดส/,
  /ารจัดสรรวัคซีนทั้งหมด\s*.{3}นวน\s*(?<total_doses>.{1,40})\s*โดส/,
  /\วันที่\s*(?<date>.{1,30})\s*เวลา\s*18.00\s*น.\s*\)/,
  /2564\s*ทั้งหมด\s*(?<total_vaccinations>.{1,40})\s*โดส/,
  /เทศ\W*วัคซีนเข็มที่ 1 .{1,3}นวน (?<people_vaccinated>.{1,40})\s*ราย/,
  /รับวัคซีน 2 เข็ม\)\s*.{3}นวน\s*(?<people_fully_vaccinated>.{1,40})\s*ราย/
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
    if (parseInt(pdfDate) === time.date) {
      console.log(`PDF date matched`);
      crawler(url)
        .then(res => {
          scrapePDF2JSON(res, regexArray).then((data) => {
            data.source_url = url
            let stringified = JSON.stringify(data, null, 2)
            console.log(stringified);
            // write to json file
            fs.writeFileSync(`./data/vaccinations.json`, stringified)
            console.log(`Scrape complete`);
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
            console.log(`Scrape failed`);
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
