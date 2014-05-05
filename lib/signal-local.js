/*
	LocalStorage signaling server - used in tests
*/

'use strict';

var Emitter = require('wildemitter');

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

var clients = {};

function Local(options) {
	options = options || {};

	if(!(this instanceof Local)) { return new Local(options); }

	if (typeof options === 'string') { options = { id: options }; }

	options.id = options.id || guid();

	this.options = options;
	this.id = this.options.id;

    for (var clientId in clients) {
        clients[clientId].emit('connected', this.id);
    }
	clients[this.id] = this;

	Emitter.call(this);
	setTimeout(this.emit.bind(this, 'ready', this.id), 10);
}

Local.prototype = new Emitter();

Local.prototype.connect = function (id) {
	var conn = new Connection(this.id, id);
	setTimeout(conn.emit.bind(conn, 'open'), 10);
	return conn;
};

Local.prototype.close = function () {
    delete clients[this.id];
    for (var clientId in clients) {
        clients[clientId].emit('disconnected', this.id);
    }
};

function Connection(from, to) {
	if(!(this instanceof Connection)) { return new Connection(from, to); }
	this.src = from;
	this.dst = to;
	Emitter.call(this);
}

Connection.prototype = new Emitter();

Connection.prototype.send = function (type, message) {
	if (!message) {
		message = type;
	} else {
		message = {
			type: type,
			msg: message
		};
	}

    clients[this.dst].emit('message', message, this.src);
};

Connection.prototype.close = function () { };

module.exports = Local;
