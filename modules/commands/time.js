const request = require('request');
const log = require('../log.js');

var exports = module.exports = {};

exports.trigger = (data) => {
	log.pass(`Time`);
	console.log(data);
};
