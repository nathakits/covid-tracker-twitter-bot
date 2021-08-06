const fs = require('fs');
const crawler = require('crawler-request');
const time = require('../modules/time')
const { scrapePDF2JSON } = require('../modules/util')
const axios = require('axios')
const { JSDOM } = require('jsdom')

// vars
let weburl = `https://ddc.moph.go.th/dcd/pagecontent.php?page=735&dept=dcd`
let regexArray = [
  /\วันที่\s*(?<date>.{1,30})\s*เวลา\s*18.00\s*น.\s*\)/,
  /2564\s*ทั้งหมด\s*(?<total_vaccinations>.{1,40})\s*โดส/,
  /เทศ\W*วัคซีนเข็มที่ 1 .{1,3}นวน (?<people_vaccinated>.{1,40})\s*ราย/,
  /รับ\s*วัคซีน\s*2\s*เข็ม\)\s*.{3}นวน\s*(?<people_fully_vaccinated>.{1,40})\s*ราย\s*เ/,
  /เข็ม.{3}\s*3\s*.Booster\s*dose.\s*.{3}นวน\s*(?<booster_vaccinated>.{1,40})\s*ราย\s*เ/,
  /รับ\s*วัคซีน\s*ทั้งหมด\s*(?<total_dose_plus>.{1,40})\s*โดส/,
  /แยก\s*.{1,4}\s*.{1,3}ที่ได้รับวัคซีนเข็มที่\s*1\s*.{1,3}นวน\s*(?<first_dose_plus>.{1,40})\s*ราย/,
  /2\s*เข็ม\W\s*.{3}นวน\s*(?<second_dose_plus>.{1,40})\s*ราย\s*แ/,
  /3\s*\WBooster\s*dose\W\s*.{3}นวน\s*(?<third_dose_plus>.{1,40})\s*ราย\s*ห/,
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
    if (parseInt(pdfDate) === parseInt(time.date)) {
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
