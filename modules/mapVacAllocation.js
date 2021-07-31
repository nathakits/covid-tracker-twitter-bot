const fs = require('fs');
const jsonfile = require('../data/vac_timeline.json')

data = jsonfile.map(data => {
  const astraAllocated = Number(data["Vac Allocated AstraZeneca"])
  const sinovacAllocateed = Number(data["Vac Allocated Sinovac"])
  const map = {
    "date": data.Date,
    "allocated_astrazeneca": astraAllocated,
    "allocated_sinovac": sinovacAllocateed,
    "allocated_total": astraAllocated + sinovacAllocateed,
  }
  return map
})

const genJSON = async () => {
  let stringify = JSON.stringify(data)
  fs.writeFile('data/vac_allocation.json', stringify, (err) => {
    if (err) throw err
    console.log(`Status: Complete`);
  });
}

genJSON()