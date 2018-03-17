/**
 * This will format the date to MMMM/DD/YYYY
 * @param date {Date} new Date() 
 */

function fullDate(date) {
    const fulldate = new Date()
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return monthNames[fulldate.getMonth()]+' '+fulldate.getDate()+', '+fulldate.getFullYear()
}

function getMonth(fulldate) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const month = new Date(fulldate).getMonth();
    return monthNames[month]
}
function getDay(fulldate) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const day = new Date(fulldate).getDay()
    return dayNames[day]
}
function getYear(fulldate) {
    return new Date(fulldate).getFullYear()
}
function getDate(fulldate) {
    return new Date(fulldate).getDate()
}

module.exports = {
    fullDate,
    getMonth,
    getDay,
    getYear,
    getDate
}   
