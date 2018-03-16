/**
 * This will format the date to MMMM/DD/YYYY
 * @param date {Date} new Date() 
 */

function fullDate(date) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return monthNames[date.getMonth()]+' '+date.getDate()+', '+date.getFullYear()
}

function getMonth(fullDate) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const month = new Date(fullDate).getMonth();
    return monthNames[month]
}
function getDay(fullDate) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const day = new Date(fullDate).getDay()
    return dayNames[day]
}
function getYear(fullDate) {
    return new Date(fullDate).getFullYear()
}
function getDate(fullDate) {
    return new Date(fullDate).getDate()
}

module.exports = {
    fullDate,
    getMonth,
    getDay,
    getYear,
    getDate
}   
