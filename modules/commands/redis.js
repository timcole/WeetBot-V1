const log = require('../log.js');
const color = require("colors/safe");
const Redis = require("redis");
const bluebird = require("bluebird");

bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);

var redis = Redis.createClient();

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

var checkCommand = async (data) => {
	try {
		var response = await redis.getAsync(`WeetBot::command::${data.channel}::${data.message.toLowerCase()}`);
		if (!response) return;

		response = response.replace("{{ user }}", data.userstate.name);

		if (response.indexOf("{{ inc }}") !== -1) {
			var inc = await redis.getAsync(`WeetBot::command::${data.channel}::${data.message.toLowerCase()}::inc`);

			if (!inc) {
				// If nothing set it to 0
				redis.set(`WeetBot::command::${data.channel}::${data.message.toLowerCase()}::inc`, 0);
				inc = 0;
			}

			if (data.userstate.mod || data.channel.replace("#", "") === data.userstate.username) {
				// If mod or channel owner runs command, inc the number
				redis.incr(`WeetBot::command::${data.channel}::${data.message.toLowerCase()}::inc`);
				inc++;
			}

			if (inc) data.client.say(data.channel, response.replace("{{ inc }}", inc));
		} else {
			data.client.say(data.channel, response);
		}
	} catch (err) {
		log.error(`${color.red("Failed")} to get command information from Redis!`);
		console.log(err)
	}
	log.pass(`${color.cyan(data.message.toLowerCase())} was issued in ${color.cyan(data.channel)} by ${color.cyan(data.userstate.name)}`);
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
