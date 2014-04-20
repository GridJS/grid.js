/*
	LocalStorage signaling server - used in tests
*/

var clients = {};

var Emitter = require('wildemitter');

function GridLocal(id) {
	if(!(this instanceof GridLocal)) { return new GridLocal(id); }

	clients[id] = this;

	Emitter.call(this);
};

GridLocal.prototype = new Emitter;

GridLocal.prototype.send = function (id, message) {
	clients[id].emit('message', message);
};

module.exports = GridLocal;