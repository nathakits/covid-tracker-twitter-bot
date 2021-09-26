const fs = require('fs');
const data = require('../data/Thailand-corrected.json')

const checkData = (data) => {
  const totalVacCum = data.map(d => d.total_vaccinations)
  const dailyVac = data.map(d => d.total_dose_plus)
  const map1 = totalVacCum.map((x, i, arr) => arr[i + 1] - x);
  map1.unshift(0)
  const num = []
  map1.forEach((el, i) => {
    if (el == dailyVac[i]) {
      // console.log(`${i + 1}`)
    } else {
      num.push(el)
      console.log(`Incorrect - ${i + 2}: ${dailyVac[i]}`)
    }
  });
  console.log(num.length);
}

checkData(data)