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
	clients[this.id] = this;
	
	Emitter.call(this);
	setTimeout(this.emit.bind(this, 'ready', this.id), 10);
}

Local.prototype = new Emitter();

Local.prototype.connect = function (id) {
	var conn = new Connection(this.id, id);

	conn.on('send', function (src, dst, message) {
		clients[dst].emit('message', message, this.src);
		if (message.type) {
			clients[dst].emit(message.type, message.msg, this.src);
		}
	});

	conn.on('close', function () {
		// delete self.connections[conn.id];
	});

	setTimeout(conn.emit.bind(conn, 'open'), 10);

	return conn;
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
	this.emit('send', this.src, this.dst, message);
};

Connection.prototype.close = function () {
	this.emit('close');
};

module.exports = Local;