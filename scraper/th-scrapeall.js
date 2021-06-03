const fs = require('fs');
// const crawler = require('crawler-request');
// const time = require('../modules/time')
// const { scrapePDF2JSON } = require('../modules/util')
const puppeteer = require('puppeteer')

let weburl = `https://ddc.moph.go.th/dcd/pagecontent.php?page=643&dept=dcd`
// let regexArray = [
//   /Sinovac\s*\W*นวนวัคซีนทั้งหมดที่ได้จัดสรร\s*.\W*นวน\s*(?<sinovac>.{1,40})\s*โดส/,
//   /AstraZeneca\s*\W*นวนวัคซีนทั้งหมดที่ได้จัดสรร\s*\W*นวน\s*(?<astrazeneca>.{1,40})\s*โดส/,
//   /ารจัดสรรวัคซีนทั้งหมด\s*.{3}นวน\s*(?<total_doses>.{1,40})\s*โดส/,
//   /\วันที่\s*(?<date>.{1,30})\s*เวลา\s*18.00\s*น.\s*\)/,
//   /2564\s*ทั้งหมด\s*(?<total_vaccinations>.{1,40})\s*โดส/,
//   /เทศ\W*วัคซีนเข็มที่ 1 .{1,3}นวน (?<people_vaccinated>.{1,40})\s*ราย/,
//   /รับวัคซีน 2 เข็ม\)\s*.{3}นวน\s*(?<people_fully_vaccinated>.{1,40})\s*ราย/
// ]

// get urls of all months
const getMonthUrls = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log(`Navigating to ${weburl}...`);
    await page.goto(weburl);
    await page.waitForSelector('#content-detail');
    const monthURLs = await page.$$eval('#content-detail p', links => {
      // Make sure the book to be scraped is in stock
      links = links.filter(link => link.querySelector('a'))
      // Extract the links from the data
      links = links.map(el => el.querySelector('a').href)
      return links;
    });
    await browser.close();
    return monthURLs
  }
  catch (error) {
    console.error(error);
    process.exit(1)
  }
};

// get urls of all dates for each month
const getDateUrls = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const monthUrls = await getMonthUrls()
    const allUrls = []
    for (const url of monthUrls) {
      await page.goto(url)
      const dateUrls = await page.$$eval('#content-detail p', links => {
        links = links.filter(link => link.querySelector('a'))
        links = links.map(el => el.querySelector('a').href)
        return links
      })
      allUrls.push(...dateUrls)
    };
    await browser.close();
    console.log(allUrls);
    console.log(allUrls.length);
    return allUrls
  }
  catch (error) {
    console.error(error);
    process.exit(1)
  }
};

getDateUrls()

// scrape each url and write to single json

