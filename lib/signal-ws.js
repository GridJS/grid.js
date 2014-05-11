/*
	WebSocket signaling server - used in production
*/

'use strict';

var Emitter = require('wildemitter');
var Message = require('grid-protocol').Messages;

function WS(options) {
    options = options || {};

    if(!(this instanceof WS)) { return new WS(options); }

    this.options = options;
    this.options.host = this.options.host || window.location.hostname;
    this.options.port = this.options.port || window.location.port;
    this.options.path = this.options.path || '';

    Emitter.call(this);
}

WS.prototype = new Emitter();

WS.prototype.open = function () {
    if (this.socket) { this.close(); }

    this.socket = new WebSocket('ws://' + this.options.host + ':' + this.options.port + this.options.path);
    this.socket.binaryType = 'arraybuffer';
    this.socket.onopen = this.emit.bind(this, 'open');
    this.socket.onerror = this.emit.bind(this, 'error');
    this.socket.onmessage = this.emit.bind(this, 'encodedMessage');

    this.on('encodedMessage', function (e) {
        var msg = Message.decode(e.data);
        this.emit('message', msg);
    });

    this.once('open', function () {
        this.open = function () {
            setTimeout(this.emit.bind(this, 'open'), 0);
        }.bind(this);
    }.bind(this));

    return this;
};

WS.prototype.send = function (message) {
    if (!this.socket) { throw new Error('Signaling channel is closed'); }
    message = new Message(this.dst, message);
    this.socket.send(message.toArrayBuffer());
};

WS.prototype.close = function () {
    this.off();
    this.socket.close();
    delete this.socket;
};

module.exports = WS;
