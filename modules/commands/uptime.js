const log = require('../log.js');
const color = require("colors/safe");
const request = require("request");
const config = require("../../config.js");

var exports = module.exports = {};

exports.trigger = (data) => {
	request.get(`https://api.twitch.tv/kraken/streams/${data.channel.replace("#", "")}?client_id=${config.credentials.client_id}`, (err, response, body) => {
		var body = JSON.parse(body);

		if (body.stream == null) {
			data.client.say(data.channel, `The stream is offline.`);
		} else {
			startTime = new Date(body.stream['created_at']);
			now = new Date().getTime();
			uptime = now - startTime;
			uptime = msToTime(uptime);

			data.client.say(data.channel, `The stream has been live for ${uptime}.`);
		}
	});

	log.pass(`${color.cyan(data.message.toLowerCase())} was issued in ${color.cyan(data.channel)} by ${color.cyan(data.userstate.name)}`);
};

var msToTime = (s) => {
	var ms = s % 1000;
	s = (s - ms) / 1000;
	var secs = s % 60;
	s = (s - secs) / 60;
	var mins = s % 60;
	var hrs = (s - mins) / 60;

	return hrs + ' hour ' + mins + ' minutes';
};
