var tmi = require("tmi.js");
var config = require("./config.json");

var options = {
    options: {
        debug: config.debug || false
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

client.connect();
