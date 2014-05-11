'use strict';

var Emitter = require('wildemitter');
var P2P = require('./p2p.js');
var Message = require('grid-protocol').Messages;
var _ = require('lodash');

function Grid(signaling, options) {
    if(!(this instanceof Grid)) { return new Grid(options); }
    Emitter.call(this);

    if (!(signaling instanceof Emitter)) { options = signaling; signaling = undefined; }

    this.options = options || {};
    this.options.signaling = signaling || require('../lib/signal-ws.js');
    this.options.connectionsLimit = this.options.connectionsLimit || 3;

    this.signalingChannel = this.options.signaling(this.options);

    this.p2p = P2P({ signalingChannel: this.signalingChannel });
    this.p2p.on('open', this.emit.bind(this, 'open'));

    this.connections = {};

    this.signalingChannel.on('message', this.dispatch.bind(this));
}

Grid.prototype = new Emitter();

Grid.prototype.dispatch = function dispatch (msg) {
    if (!msg.type) { return; }
    msg.type = msg.type.toLowerCase();

    if (msg.type in this) { this[msg.type].call(this, msg); }
};

Grid.prototype.connected = function (msg) {
    if (_.keys(this.connections).length > this.options.connectionsLimit) { return; }
    if (this.connections[msg.id]) { return; }

    this.connections[msg.id] = this.p2p.connect(msg.id);
};

Grid.prototype.disconnected = function (msg) {
    if (!this.connections[msg.id]) { return; }
    this.connections[msg.id].close();
    delete this.connections[msg.id];
};

Grid.prototype.welcome = function (msg) {
    this.id = this.id || msg.id;
    this.emit('ready', this.id);
};

Grid.prototype.log = function(obj) {
    this.signalingChannel.sendRaw(new Message.Log(obj).toArrayBuffer());
};

module.exports = Grid;
