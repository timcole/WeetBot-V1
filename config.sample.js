require('dotenv').config()

module.exports = {
	credentials: {
		username: process.env.TWITCH_USER,
		oauth: process.env.TWITCH_OAUTH
	},
	channels: [],
	commands: [
		{
			command: "!ping",
			response: "PONG"
		}
	]
}
