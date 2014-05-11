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
    Emitter.call(this);

	options = options || {};

	if(!(this instanceof Local)) { return new Local(options); }

	if (typeof options === 'string') { options = { id: options }; }

	options.id = options.id || guid();

	this.options = options;
	this.id = this.options.id;
}

Local.prototype = new Emitter();

Local.prototype.open = function () {
    for (var clientId in clients) {
        clients[clientId].emit('connected', this.id);
    }

    clients[this.id] = this;
    setTimeout(this.emit.bind(this, 'open'), 0);
    return this;
};

Local.prototype.close = function () {
    this.off();
    delete clients[this.id];
    for (var clientId in clients) {
        clients[clientId].emit('disconnected', this.id);
    }
};

Local.prototype.send = function (dest, message) {
    if (clients[dest]) {
        clients[dest].emit('message', message, this.id);
    }
};

module.exports = Local;
