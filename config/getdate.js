Date.prototype.getFormatDate = function() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return this.getDate()+' '+monthNames[this.getMonth()]+', '+this.getFullYear()
}

var getFormat = new Date().getFormatDate()

module.exports = {
    getdate: getFormat
} 