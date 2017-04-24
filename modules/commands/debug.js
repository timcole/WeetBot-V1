const log = require('../log.js');
const color = require("colors/safe");

var exports = module.exports = {};

exports.trigger = (data) => {
    var user = data.userstate['display-name'] || data.userstate.username;
	data.client.say(data.channel, `Hey there @${user}!`);
	log.pass(`Said ${color.cyan("hello")} to ${color.cyan(user)}.`);
	console.log(data.message)
};
