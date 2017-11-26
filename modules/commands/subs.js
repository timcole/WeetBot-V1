const log = require('../log.js');
const color = require("colors/safe");
const request = require("request");
const config = require("../../config.js");

var exports = module.exports = {};

exports.trigger = (data) => {
	request.get(`https://api.twitch.tv/api/channels/modesttim/subscriber_count`, {
		headers: {
			Authorization: `OAuth ${process.env.TWITCH_OAUTH_TOKEN}`
		},
		json: true
	}, (err, response, body) => {
		if (body.count) {
			data.client.say(data.channel, `There are currently ${body.count} subs! (${body.score} Sub Points)`);
		} else {
			data.client.say(data.channel, `Sorry but I couldn't get the total number of subs BibleThump`);
			log.error(`${color.red("Failed")} to get the total number of subs.`);
		}
	});

	log.pass(`${color.cyan(data.message.toLowerCase())} was issued in ${color.cyan(data.channel)} by ${color.cyan(data.userstate.name)}`);
};
