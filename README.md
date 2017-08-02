# WeetBot
**WeetBot is yet another chatbot for twitch.tv**

---  
##### Current features:
  - Static commands
  - NodeJS based module commands
  - Redis commands

##### TODO:
  - Rate limiting
  - Some pre-built command modules
  - Sub only and/or Mod only commands
  - Command module install manager

---
### Setup

```sh
$ git clone git@github.com:TimothyCole/WeetBot-Twitch-Chatbot.git
$ cd WeetBot-Twitch-Chatbot
$ npm install
$ cp config.sample.js config.js
$ cp .env.sample .env
$ vim config.js
$ vim .env
```

---
### Config
Fill out `config.js` with your information and commands.

`credentials`: *(Required | Object)*
  - `username` *(Required | String)*
  - `oauth` *(Required | String)*
  - `client_id` *(Optional | Required for some modules | String)*

`channels`: *(Required | Array of Strings | Start with #)*

`commands`: *(Required | Array of Objects)*
  - `command` *(Required | String)* - *Use \* for every message*
  - `response` *(Optional | String)* - *Use `{{ user }}` for username*
  - `module` *(Optional | String)*

---
### Run
```sh
$ npm start
```

---
### Making a Command Module

Command modules must be ran inside `modules/commands/`.

##### Logging
```JS
const log = require('../log.js');

log.pass("Green Plus!");
log.warn("Yellow Tilde!");
log.error("Red Hyphen!");
log.critical("Red Exclamation Mark!"); // KILLS PROCESS
```
*Production modules shouldn't use `console.log()`*

##### Trigger
Command modules must incude a `trigger` export with a` data` param that will be called on a command.  
`data.client`: (Object | [tmi.js](https://docs.tmijs.org/v1.1.2/Commands.html) connecton)  
`data.channel`: (String)  
`data.userstate`: (String | Chatter Infomation)  
`data.message`: (String)  

##### Example Command Module - `modules/commands/example.js`
```JS
const log = require('../log.js');
const color = require("colors/safe");

var exports = module.exports = {};

exports.trigger = (data) => {
    var user = data.userstate['display-name'] || data.userstate.username;
	data.client.say(data.channel, `Hey there @${user}!`);
	log.pass(`Said ${color.cyan("hello")} to ${color.cyan(user)}.`);
};
```

##### Example Command Module Config
```JSON
{
	"command": "!hello",
	"module": "example"
}
```

---
### Redis command module

##### Example Config
```JS
{
	command: "*",
	method: "checkCommand",
	module: "redis"
},
{
	command: "!addcom",
	method: "addCommand",
	module: "redis"
},
{
	command: "!delcom",
	method: "removeCommand",
	module: "redis"
},
{
	command: "!commands",
	method: "getCommands",
	module: "redis"
}
```

---
### Uptime command module
[Required](#config): `client_id`
##### Example Config
```JS
{
	command: "!uptime",
	module: "uptime"
}
```
