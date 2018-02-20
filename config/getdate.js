Date.prototype.getFormatDate = function() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return monthNames[this.getMonth()]+' '+this.getDate()+', '+this.getFullYear()
}

var getFormat = new Date().getFormatDate()

module.exports = {
    getdate: getFormat
} 