const log = require('../log.js');
const color = require("colors/safe");
const request = require("request");
const config = require("../../config.js");

var exports = module.exports = {};

exports.trigger = (data) => {
	request.get(`https://api.twitch.tv/helix/users/follows?to_id=${data.userstate['room-id']}&from_id=${data.userstate['user-id']}`, {
		headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID },
		json: true
	}, (err, response, body) => {
		if (body.data.length == 0) {
			data.client.say(data.channel, `You're not following @${data.userstate.name} BibleThump`);
		} else {
			startTime = new Date(body.data[0]['followed_at']);
			now = new Date().getTime();
			uptime = now - startTime;
			uptime = dhm(uptime);

			data.client.say(data.channel, `@${data.userstate.name} You've been following for ${uptime}!`);
		}
	});

	log.pass(`${color.cyan(data.message.toLowerCase())} was issued in ${color.cyan(data.channel)} by ${color.cyan(data.userstate.name)}`);
};

function dhm(t) {
	var cd = 24 * 60 * 60 * 1000,
		ch = 60 * 60 * 1000,
		d = Math.floor(t / cd),
		h = Math.floor((t - d * cd) / ch),
		m = Math.round((t - d * cd - h * ch) / 60000);
	if (m === 60) {
		h++;
		m = 0;
	}
	if (h === 24) {
		d++;
		h = 0;
	}
	// return [d, pad(h), pad(m)].join(':');
	return `${ d } days ${ h } hour ${ m } minutes`;
}
