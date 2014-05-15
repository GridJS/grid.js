/*
	WebSocket signaling server - used in production
*/

'use strict';

var Emitter = require('wildemitter');
var Message = require('grid-protocol').Messages;
var _ = require('lodash');

function WS(options) {
    options = options || {};
    if(!(this instanceof WS)) { return new WS(options); }

    Emitter.call(this);

    this.options = options;
    this.options.host = this.options.host || window.location.hostname;
    this.options.port = this.options.port || window.location.port;
    this.options.path = this.options.path || '';

    this.socket = new WebSocket('ws://' + this.options.host + ':' + this.options.port + this.options.path);
    this.socket.binaryType = 'arraybuffer';
    this.socket.onopen = this.emit.bind(this, 'open');
    // this.socket.onclose = this.onclose.bind(this);
    this.socket.onerror = this.emit.bind(this, 'error');
    this.socket.onmessage = this.emit.bind(this, 'encodedMessage');

    this.on('encodedMessage', function (e) {
        var msg = Message.decode(e.data);
        this.emit('message', msg);
        this.emit('message:' + (msg.type || 'untyped').toLowerCase(), msg);
    }.bind(this));
}

WS.prototype = new Emitter();

WS.prototype.send = function (dest, message) {
    message = new Message(dest, message);
    this.sendRaw(message.toArrayBuffer());
};

WS.prototype.sendRaw = function (message) {
    if (this.socket.readyState !== 1) { return; }
    this.socket.send(message);
};

WS.prototype.close = function () {
    _(this.callbacks).forEach(function(cb, event) { this.off(event); }.bind(this));
    this.socket.close();
};

module.exports = WS;
