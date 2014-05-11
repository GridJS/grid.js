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
    this.options.candidatesLimit = this.options.candidatesLimit || 32;

    this.signalingChannel = this.options.signaling(this.options);

    this.p2p = P2P({ signalingChannel: this.signalingChannel });
    this.p2p.on('open', this.emit.bind(this, 'open'));

    this.connections = {};
    this.candidates = [];

    this.signalingChannel.on('message', this.dispatch.bind(this));
}

Grid.prototype = new Emitter();

Grid.prototype.dispatch = function dispatch (msg) {
    if (!msg.type) { return; }
    msg.type = msg.type.toLowerCase();

    if (msg.type in this) { this[msg.type].call(this, msg); }
};

Grid.prototype.connected = function (msg) {
    this.candidates.push(msg.id);
    this.candidates = _.last(this.candidates, this.options.candidatesLimit);

    if (_.keys(this.connections).length >= this.options.connectionsLimit) { return; }
    this.log({ what: 'connecting', where: msg.id });
    if (this.connections[msg.id]) { return; }
    this.connections[msg.id] = this.p2p.connect(msg.id);

    this.connections[msg.id].once('open', function () {
        this.log({ what: 'connected', where: msg.id });
    }.bind(this));

    this.connections[msg.id].once('close', function () {
        this.log({ what: 'disconnected', from: msg.id });
    }.bind(this));
};

Grid.prototype.disconnected = function (msg) {
    this.candidates = _.without(this.candidates, msg.id);
    if (!this.connections[msg.id]) { return; }
    this.connections[msg.id].close();
    delete this.connections[msg.id];

    // Here should be logic to fulfill connectionsLimit if necessary
};

Grid.prototype.welcome = function (msg) {
    this.id = this.id || msg.id;
    this.emit('ready', this.id);
};

Grid.prototype.log = function(obj) {
    this.signalingChannel.sendRaw(new Message.Log(obj).toArrayBuffer());
};

module.exports = Grid;
