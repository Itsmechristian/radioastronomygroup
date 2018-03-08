/**
 * This will format the date to MMMM/DD/YYYY
 * @param date new Date() 
 */

module.exports = function(date) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return monthNames[date.getMonth()]+' '+date.getDate()+', '+date.getFullYear()
}