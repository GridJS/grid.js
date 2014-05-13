/*
	LocalStorage signaling server - used in tests
*/

'use strict';

var Emitter = require('wildemitter');
var Message = require('grid-protocol').Messages;

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

function Local() {
    Emitter.call(this);
	this.id = guid();

    this.on('encodedMessage', function (msg) {
        var message = Message.decode(msg);
        this.emit('message', message, message.src);
        this.emit('message:' + (message.type || 'untyped').toLowerCase(), message, message.src);
    }.bind(this));

    setTimeout(function() {
        this.emit('open');
        clients[this.id] = this;
        this.emit('encodedMessage', (new Message.Welcome(this.id)).toArrayBuffer());
        for (var clientId in clients) {
            if (clientId === this.id) { return; }
            clients[clientId].emit('encodedMessage', (new Message.Connected(this.id)).toArrayBuffer());
        }

    }.bind(this), 0);
}

Local.prototype = new Emitter();

Local.prototype.close = function () {
    delete clients[this.id];
    for (var clientId in clients) {
        clients[clientId].emit('encodedMessage', (new Message.Disconnected(this.id)).toArrayBuffer());
    }
};

Local.prototype.send = function (dest, message) {
    if (clients[dest]) {
        clients[dest].emit('encodedMessage', (new Message(dest, message, this.id)).toArrayBuffer());
    }
};


module.exports = Local;
