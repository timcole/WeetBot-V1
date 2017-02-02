var exports = module.exports = {};
var modules = [];

const log = require("./log.js");

exports.load = (config, start) => {
	for (var i = 0; i < config.modules.length; i++) {
		modules[config.modules[i].require] = require(`./commands/${config.modules[i].require}.js`);
	}

	log.pass(`Loaded ${config.modules.length} command modules.`);

	start();
}

exports.check = (data) => {

};
