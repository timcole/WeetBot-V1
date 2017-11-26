const WebSocket = require("ws");
const log = require("./log");
const Events = require("events")

String.prototype.nonce = function (length) {
	var t = "";
	var pos = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < length; i++) {
		t += pos.charAt(Math.floor(Math.random() * pos.length));
	}
	return t;
};

var PubSub = function () {
	this.url = "wss://pubsub-edge.twitch.tv";
	this.sub = "following.51684790";

	this.cache = [];

	this.connection = new WebSocket(this.url);

	this.connection.on("open", () => { this.onOpen() });
	this.connection.on("message", (msg) => { this.onMsg(msg) })
	this.connection.on("close", () => { this.onClose() })
};

PubSub.prototype.__proto__ = Events.EventEmitter.prototype;

PubSub.prototype.heartbeat = function () {
	this.connection.send(JSON.stringify({
		type: "PING"
	}));
};

PubSub.prototype._topic = function (type, topic) {
	this.connection.send(JSON.stringify({
		type,
		nonce: "".nonce(32),
		data: {
			topics: [topic]
		}
	}));
};

PubSub.prototype.subscribe = function (topic) { this._topic("LISTEN", topic); }
PubSub.prototype.unsubscribe = function (topic) { this._topic("UNLISTEN", topic); }

PubSub.prototype.onOpen = function () {
	log.pass("PubSub Connected.");
	this.heartbeat();
	this.subscribe(this.sub);
	this.heartbeats = setInterval(() => {
		this.heartbeat();
	}, 1000 * 120);
};

PubSub.prototype.onClose = function () {
	log.error("PubSub Disconnected.");
	log.warn("PubSub reconnecting in 30 seconds");
	clearInterval(this.heartbeats);
	setTimeout(() => { new PubSub(); }, 30000);
};

PubSub.prototype.onMsg = function (msg) {
	msg = JSON.parse(msg);
	if (msg.type === "MESSAGE" && msg.data.topic === this.sub) {
		var username = JSON.parse(msg.data.message)['display_name'];
		if (this.cache.indexOf(username) === -1) this.emit("follower", username);
		this.cache.push(username);
	}
};

module.exports = PubSub;
