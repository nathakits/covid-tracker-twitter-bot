const formatMonth = (monthNum) => {
  let _month = monthNum + 1
  if (_month < 10) {
    return (`0${_month}`)
  } else {
    return _month
  }
}

const formatDate = (dateNum) => {
  if (dateNum < 10) {
    return (`0${dateNum}`)
  } else {
    return dateNum
  }
}


let d = new Date()
let year = d.getFullYear()
let month = formatMonth(d.getMonth())
let date = formatDate(d.getDate())
let hours = d.getHours()
let minutes = d.getMinutes()
let seconds = d.getSeconds()
let ampm = hours >= 12 ? 'PM' : 'AM';
let formattedMonth = month
let currentDate = `${date}-${month}-${year}`
let currentDateTime = `${date}-${month}-${year} ${hours}:${minutes}:${seconds}${ampm}`


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