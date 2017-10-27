const tmi = require("tmi.js");
const color = require("colors/safe");
const config = require("./config.js");
const log = require("./modules/log.js");
const controller = require("./modules/controller.js");

controller.load(config, () => {
	const options = {
		options: {
			debug: false
		},
		connection: {
			reconnect: true
		},
		identity: {
			username: config.credentials.username,
			password: config.credentials.oauth
		},
		channels: config.channels
	};

	var client = new tmi.client(options);

	client.on("connecting", () => {
		log.warn(`Connecting to ${color.magenta("Twitch")} as ${color.cyan(config.credentials.username)}.`);
	});

	client.on("connected", () => {
		log.pass(`Connected to ${color.magenta("Twitch")}.`);
		log.pass(`Joined ${color.cyan(config.channels.join(", "))}.`);
	});

	client.on("disconnected", () => {
		log.error(`Disconnected from ${color.magenta("Twitch")}.`);
	});

	client.on("chat", (channel, userstate, message, self) => {
		if (self) return;
		controller.check({client, channel, userstate, message});
	});

	client.on("subscription", (channel, username, method, message, userstate) => {
		if (typeof config.sub_alert === "string") client.say(channel, config.sub_alert.replace("{{ user }}", `@${username}`));
		log.pass(`${color.cyan(username)} just subbed in ${color.cyan(channel)}`);
	});

	client.on("resub", (channel, username, months, message, userstate, methods) => {
		if (typeof config.sub_alert === "string") client.say(channel, config.sub_alert.replace("{{ user }}", `@${username}`));
		log.pass(`${color.cyan(username)} just resubbed in ${color.cyan(channel)} for ${months} months.`);
	});

	client.on("cheer", function (channel, userstate, message) {
		if (typeof config.cheer_alert === "string") client.say(channel, config.cheer_alert.replace("{{ user }}", `@${userstate.username}`).replace("{{ bits }}", userstate.bits));
		log.pass(`${color.cyan(userstate.username)} just cheered in ${color.cyan(channel)} with ${userstate.bits} bits.`);
	});

	client.connect();
});
