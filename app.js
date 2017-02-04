const tmi = require("tmi.js");
const color = require("colors/safe");
const config = require("./config.json");
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

	client.connect();
});
