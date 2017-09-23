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
			if(!data.userstate.mod && data.channel.replace("#", "") != data.userstate.username) break;
			addCommand(data);
			break;
		case "removeCommand":
			if(!data.userstate.mod && data.channel.replace("#", "") != data.userstate.username) break;
			removeCommand(data);
			break;
		case "checkCommand":
			checkCommand(data);
			break;
		case "getCommands":
			getCommands(data);
			break;
		case "incrChatter":
			incrChatter(data);
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
		redis.set(`WeetBot::command::${data.channel}::${command}`, response, () => {
			data.client.say(data.channel, `${command} was added as a command! PogChamp`);
			log.pass(`${color.cyan(command)} was ${color.green("created")} in ${color.cyan(data.channel)} by ${color.cyan(data.userstate.name)}`);
		});
	}
};

var removeCommand = (data) => {
	var params = data.message.split(" ");
	params.splice(0, 1); // Remove addCommand trigger method

	var command = params[0];
	params.splice(0, 1); // Remove command

	if(command) {
		redis.del(`WeetBot::command::${data.channel}::${command}`, () => {
			data.client.say(data.channel, `Bye bye ${command}. BibleThump`);
			log.pass(`${color.cyan(command)} was ${color.red("removed")} in ${color.cyan(data.channel)} by ${color.cyan(data.userstate.name)}`);
		});
	}
};

var checkCommand = (data) => {
	redis.get(`WeetBot::command::${data.channel}::${data.message.toLowerCase()}`, (err, val) => {
		if(val) {
			data.client.say(data.channel, val);
			log.pass(`${color.cyan(data.message.toLowerCase())} was issued in ${color.cyan(data.channel)} by ${color.cyan(data.userstate.name)}`);
		}
	});
};

var getCommands = (data) => {
	redis.keys(`WeetBot::command::${data.channel}::*`, (err, val) => {
		if (val.length > 1) {
			var commands = `${val.slice(0, -1).join(', ')} and ${val.slice(-1)}`.replace(new RegExp(`WeetBot::command::${data.channel}::`, 'g'), "");
			var message = `The commands for ${data.channel.replace("#", "")} are ${commands}`
		} else if (val.length == 1) {
			var commands = val.join(', ').replace(new RegExp(`WeetBot::command::${data.channel}::`, 'g'), "");
			var message = `The only command for ${data.channel.replace("#", "")} is ${commands}`
		} else {
			var message = `I couldn't find any commands for ${data.channel.replace("#", "")}. BibleThump`;
		}
		data.client.say(data.channel, message);
		log.pass(`${color.cyan(data.message.toLowerCase())} was issued in ${color.cyan(data.channel)} by ${color.cyan(data.userstate.name)}`);
	});
};

var incrChatter = (data) => {
	redis.incr(`WeetBot::total::${data.channel}::${data.userstate["user-id"]}`);
};
