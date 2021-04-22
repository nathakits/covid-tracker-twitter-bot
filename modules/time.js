const formatMonth = (monthNum) => {
  let _month = monthNum + 1
  if (_month < 10) {
    return (`0${_month}`)
  } else {
    return _month
  }
}

let d = new Date()
let year = d.getFullYear()
let month = d.getMonth()
let date = d.getDate()
let hours = d.getHours()
let minutes = d.getMinutes()
let seconds = d.getSeconds()
let ampm = hours >= 12 ? 'PM' : 'AM';
let formattedMonth = formatMonth(month)
let currentDate = `${date}-${formatMonth(month)}-${year}`
let currentDateTime = `${date}-${formatMonth(month)}-${year} ${hours}:${minutes}:${seconds}${ampm}`


module.exports = {
  d,
  year,
  month,
  formattedMonth,
  date,
  hours,
  minutes,
  seconds,
  currentDate,
  currentDateTime
}