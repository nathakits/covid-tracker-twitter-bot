let d = new Date()
let year = d.getFullYear()
let month = d.getMonth()
let date = d.getDate()
let hours = d.getHours()
let minutes = d.getMinutes()
let seconds = d.getSeconds()
let ampm = hours >= 12 ? 'PM' : 'AM';
let currentDate = `${year}-${month}-${date}`
let currentDateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}${ampm}`

module.exports = {
  d,
  year,
  month,
  date,
  hours,
  minutes,
  seconds,
  currentDate,
  currentDateTime
}