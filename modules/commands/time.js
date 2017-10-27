const log = require('../log.js');
const color = require("colors/safe");

var exports = module.exports = {};

exports.trigger = (data) => {
	data.client.say(data.channel, `The current time is ${log.time()}`);
	log.pass(`${color.cyan(data.message.toLowerCase())} was issued in ${color.cyan(data.channel)} by ${color.cyan(data.userstate.name)}`);
};
