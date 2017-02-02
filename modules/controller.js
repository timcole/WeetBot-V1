var exports = module.exports = {};
var config;
var modules = [];

const log = require("./log.js");
const color = require("colors/safe");

exports.load = (cfg, start) => {
	config = cfg;
	var loaded = 0;

	for (var i = 0; i < config.commands.length; i++) {
		if(typeof modules[config.commands[i].module] !== 'undefined') log.critical("You can't have two modules with the same name loaded!");
		if(config.commands[i].module) {
			modules[config.commands[i].module] = require(`./commands/${config.commands[i].module}.js`);
			loaded++;
		}
	}

	log.pass(`Loaded ${color.cyan(loaded)} command modules.`);

	start();
}

exports.check = (data) => {
	for (var i = 0; i < config.commands.length; i++) {
		if (data.message.toLowerCase() === config.commands[i].command.toLowerCase()) {
			if(config.commands[i].module) modules[config.commands[i].module].trigger(data);
			if(config.commands[i].response) {
				data.client.say(data.channel, config.commands[i].response);
				log.pass(`${color.cyan(config.commands[i].command.toLowerCase())} was issued in ${color.cyan(data.channel)} by ${color.cyan(data.userstate['display-name'] || data.userstate.username)}`);
			}
		}
	}
};
