const fs = require('fs');
const jsonfile = require('../data/vac_timeline.json')

allocation = jsonfile.map(data => {
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

vacGiven = jsonfile.map(data => {
  // astra
  const astra1Cum = Number(data["Vac Given AstraZeneca 1 Cum"])
  const astra2Cum = Number(data["Vac Given AstraZeneca 2 Cum"])
  // sinovac
  const sinovac1Cum = Number(data["Vac Given Sinovac 1 Cum"])
  const sinovac2Cum = Number(data["Vac Given Sinovac 2 Cum"])
  // sinopharm
  const sinopharm1Cum = Number(data["Vac Given Sinopharm 1 Cum"])
  const sinopharm2Cum = Number(data["Vac Given Sinopharm 2 Cum"])
  // total
  const totalCum = astra1Cum + astra2Cum + sinovac1Cum + sinovac2Cum + sinopharm1Cum + sinopharm2Cum
  const map = {
    "date": data.Date,
    "astrazeneca_1_cum": astra1Cum,
    "astrazeneca_2_cum": astra2Cum,
    "sinovac_1_cum": sinovac1Cum,
    "sinovac_2_cum": sinovac2Cum,
    "sinopharm_1_cum": sinopharm1Cum,
    "sinopharm_2_cum": sinopharm2Cum,
    "total_cum": totalCum,
  }
  return map
})

const genvacGivenJSON = async () => {
  let stringify = JSON.stringify(vacGiven)
  fs.writeFile('data/vac_given.json', stringify, (err) => {
    if (err) throw err
    console.log(`Status: Vac given Complete`);
  });
}

const genAllocationJSON = async () => {
  let stringify = JSON.stringify(allocation)
  fs.writeFile('data/vac_allocation.json', stringify, (err) => {
    if (err) throw err
    console.log(`Status: Allocation Complete`);
  });
}

genAllocationJSON()
genvacGivenJSON()