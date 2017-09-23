const log = require('../log.js');
const color = require("colors/safe");

var exports = module.exports = {};

exports.trigger = (data) => {
	data.client.say(data.channel, `Hey there @${data.userstate.name}!`);
	log.pass(`Said ${color.cyan("hello")} to ${color.cyan(data.userstate.name)}.`);
};
