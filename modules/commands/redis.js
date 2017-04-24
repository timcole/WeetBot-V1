const log = require('../log.js');
const color = require("colors/safe");
const redis = require("redis").createClient();

var exports = module.exports = {};

redis.on("error", (err) => {
	log.critical("Failed to connect to redis");
	console.log(err);
});

exports.trigger = (data, config) => {
	switch(config.method) {
		case "addCommand":
			if(!data.userstate.mod) break;
			addCommand(data);
			break;
		case "removeCommand":
			if(!data.userstate.mod) break;
			removeCommand(data);
			break;
		case "checkCommand":
			checkCommand(data);
			break;
		default:
			return;
	}
};

var addCommand = (data) => {
	var params = data.message.split(" ");
	params.splice(0, 1); // Remove addCommand trigger method

	var command = params[0];
	params.splice(0, 1); // Remove command
	var response = params.join(" ");

	if(command && response) {
		redis.set(`WeetBot::command::${command}`, response, () => {
			log.pass(`${color.cyan(command)} was created in ${color.cyan(data.channel)} by ${color.cyan(data.userstate['display-name'] || data.userstate.username)}`);
		});
	}
};

var removeCommand = (data) => {
	var params = data.message.split(" ");
	params.splice(0, 1); // Remove addCommand trigger method

	var command = params[0];
	params.splice(0, 1); // Remove command

	if(command) {
		redis.del(`WeetBot::command::${command}`, () => {
			log.pass(`${color.cyan(command)} was removed in ${color.cyan(data.channel)} by ${color.cyan(data.userstate['display-name'] || data.userstate.username)}`);
		});
	}
};

var checkCommand = (data) => {
	redis.get(`WeetBot::command::${data.message.toLowerCase()}`, (err, val) => {
		if(val) {
			data.client.say(data.channel, val);
			log.pass(`${color.cyan(data.message.toLowerCase())} was issued in ${color.cyan(data.channel)} by ${color.cyan(data.userstate['display-name'] || data.userstate.username)}`);
		}
	});
};
