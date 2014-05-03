/*
	WebSocket signaling server - used in production
*/

'use strict';

var Emitter = require('wildemitter');
var Message = require('grid-protocol').Message;

function WS(options) {
    options = options || {};

    if(!(this instanceof WS)) { return new WS(options); }

    this.options = options;

    Emitter.call(this);

    this.socket = new WebSocket('ws://' + options.host + ':' + options.port + '/');
    this.socket.binaryType = 'arraybuffer';

    this.socket.onopen = this.emit.bind(this, 'open');
    this.socket.onmessage = this.emit.bind(this, '_message');

    this.on('_message', function (data, flags) {
        if (!flags) { this.emit('error', 'Recieved message is not binary! ' + data); return; }
        var msg = Message.decode(data);
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

    conn.on('send', function (src, dst, message) {
        message = new Message(Message.Type.UNIVERSAL, dst, src, message);
        this.socket.send(message.toArrayBuffer());
    }.bind(this));

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

module.exports = WS;
