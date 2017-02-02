var exports = module.exports = {};
var config;
var modules = [];

const log = require("./log.js");
const color = require("colors/safe");

exports.load = (cfg, start) => {
	config = cfg;
	var loaded = 0;

	for (var i = 0; i < config.modules.length; i++) {
		if(typeof modules[config.modules[i].require] !== 'undefined') log.critical("You can't have two modules with the same name loaded!");
		if(config.modules[i].require) {
			modules[config.modules[i].require] = require(`./commands/${config.modules[i].require}.js`);
			loaded++;
		}
	}

	log.pass(`Loaded ${color.cyan(loaded)} command modules.`);

	start();
}

exports.check = (data) => {
	for (var i = 0; i < config.modules.length; i++) {
		if (data.message.toLowerCase() === config.modules[i].command.toLowerCase()) {
			if(config.modules[i].require) modules[config.modules[i].require].trigger(data);
			if(config.modules[i].response) {
				data.client.say(dat	a.channel, config.modules[i].response);
				log.pass(`${color.cyan(config.modules[i].command.toLowerCase())} was issued in ${color.cyan(data.channel)} by ${color.cyan(data.userstate['display-name'] || data.userstate.username)}`);
			}
		}
	}
};
