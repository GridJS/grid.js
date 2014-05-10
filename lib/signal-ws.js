/*
	WebSocket signaling server - used in production
*/

'use strict';

var Emitter = require('wildemitter');
var Message = require('grid-protocol').Messages;

function WS(options) {
    options = options || {};
    options.path = options.path || '';

    if(!(this instanceof WS)) { return new WS(options); }

    this.options = options;

    Emitter.call(this);

    this.socket = new WebSocket('ws://' + options.host + ':' + options.port + '/' + options.path);
    this.socket.binaryType = 'arraybuffer';

    this.socket.onopen = this.emit.bind(this, 'open');
    this.socket.onmessage = this.emit.bind(this, '_message');

    this.on('_message', function (e) {
        var msg = Message.decode(e.data);
        if (msg.type === 0) {
            this.id = msg.dest;
            this.emit('ready', this.id);
        } else {
            this.emit('message', msg);
        }
    }.bind(this));
}

WS.prototype = new Emitter();

WS.prototype.connect = function (id) {
    var conn = new Connection(this.id, id, this.socket);
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
            data: message
        };
    }

    message = new Message(this.dst, message);
    this.socket.send(message.toArrayBuffer());
};

Connection.prototype.close = function () {
    this.socket.close();
};

module.exports = WS;
