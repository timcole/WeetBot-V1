const log = require('../log.js');
const color = require("colors/safe");
const request = require("request");

var exports = module.exports = {};

exports.trigger = (data) => {
    var user = data.userstate['display-name'] || data.userstate.username;

	request.get('https://timcole.me/api/stream', (err, response, body) => {
		var body = JSON.parse(body);

		if (body.stream == null) {
			data.client.say(data.channel, `The stream is offline.`);
		} else {
			startTime = new Date(body.stream.stream['created_at']);
			now = new Date().getTime();
			uptime = now - startTime;
			uptime = msToTime(uptime);

			data.client.say(data.channel, `The stream has been live for ${uptime}.`);
		}
	});
	log.pass(`Said ${color.cyan("hello")} to ${color.cyan(user)}.`);
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
