const fs = require('fs');
const axios = require('axios').default;
const fileURL = "https://raw.githubusercontent.com/wiki/porames/the-researcher-covid-data/vaccination/national-vaccination-timeseries.json"

const genJSON = async () => {
  axios({
    method: 'get',
    url: fileURL,
    responseType: 'json'
  }).then((response) => {
    let stringify = JSON.stringify(response.data)
    fs.writeFile('data/dashboard/national-vaccination-timeseries.json', stringify, (err) => {
      if (err) throw err
      console.log(`Status: Complete`);
    });
  })
  
}

genJSON()