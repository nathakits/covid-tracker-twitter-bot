const fs = require('fs');
const crawler = require('crawler-request');
const time = require('../modules/time')
const { scrapePDF2JSON } = require('../modules/util')
const axios = require('axios')
const { JSDOM } = require('jsdom')

// vars
let weburl = `https://ddc.moph.go.th/dcd/pagecontent.php?page=722&dept=dcd`
let regexArray = [
  /\วันที่\s*(?<date>.{1,30})\s*เวลา\s*18.00\s*น.\s*\)/,
  /ฉีดวัคซีนทั้งหมด\s*\W\s*(?<total_vaccinations>.{1,20})\s*โดส/,
  /โควิด\s*19รายสะสม\s*(?<people_vaccinated>.{1,11})\s*ราย/,
  /สะสม\s*(?<people_fully_vaccinated>.{1,11})\s*จำนวน/,
  /วันที่\s*28\s*กุมภาพันธ์\s*2564\s*เพิ่มขึ้น\s*\+\s*(?<total_dose_plus>.{1,20})\s*โดส/,
  /1\s*รายใหม่\s*\W\s*(?<first_dose_plus>.{1,20})\s*ราย/,
  /2\s*รายใหม่\s*\W\s*(?<second_dose_plus>.{1,20})\s*ราย/,
  /มSinovac(?<sinoToday>\d*,.{1,3})\d*,.{1,3}(?<sinoTotal>\d*,.{1,3},.{1,3})/,
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
            console.log(`Scrape complete`);
            data.source_url = url
            let stringified = JSON.stringify(data, null, 2)
            console.log(stringified);
            // write to json file
            fs.writeFileSync(`./data/vaccinations.json`, stringified)
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
