const color = require('colors');

var time = function() {
	var date = new Date();

	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;

	var min = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;

	var sec = date.getSeconds();
	sec = (sec < 10 ? "0" : "") + sec;

	return `${hour}:${min}:${sec}`;
};

var exports = module.exports = {};

exports.pass = (msg) => {
	console.log("   + ".green + time() + " - " + msg);
}

exports.warn = (msg) => {
	console.log("   ~ ".yellow + time() + " - " + msg);
}

exports.error = (msg) => {
	console.log("   - ".red + time() + " - " + msg);
}

exports.critical = (msg) => {
	console.log("   ! ".red + time() + " - " + msg);
	process.exit(1);
}

exports.numberFormat = (x) => {
	x = Math.ceil(x) || "--";
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
