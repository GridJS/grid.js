'use strict';

var Emitter = require('wildemitter');
var P2P = require('./p2p.js');
var Message = require('grid-protocol').Messages;
var _ = require('lodash');

function Grid(options) {
    if(!(this instanceof Grid)) { return new Grid(options); }
    Emitter.call(this);

    this.options = options || {};
    this.options.signaling = this.options.signaling || require('../lib/signal-ws.js');
    this.options.connectionsLimit = this.options.connectionsLimit || 3;
    this.options.candidatesLimit = this.options.candidatesLimit || 32;

    this.signalingChannel = this.options.signaling(this.options);

    this.p2p = P2P({ signalingChannel: this.signalingChannel });
    this.p2p.on('open', this.emit.bind(this, 'open'));
    this.p2p.on('connection', this.emit.bind(this, 'connection'));

    this.connections = {};
    this.candidates = [];

    this.signalingChannel.on('message', this.dispatch.bind(this));
}

Grid.prototype = new Emitter();

Grid.prototype.close = function close() {
    this.p2p.close();
    this.signalingChannel.close();
};

Grid.prototype.dispatch = function dispatch (msg) {
    if (!msg.type) { return; }
    msg.type = msg.type.toLowerCase();

    if (msg.type in this) { this[msg.type].call(this, msg); }
};

Grid.prototype.connected = function (msg) {
    if (_.keys(this.connections).length >= this.options.connectionsLimit) {
        this.candidates.push(msg);
        this.candidates = _.last(this.candidates, this.options.candidatesLimit);
        return;
    }

    this.log({ what: 'connecting', where: msg.id });
    if (this.connections[msg.id]) { return; }

    this.connections[msg.id] = this.p2p.connect(msg.id);
    this.emit('connection', this.connections[msg.id], msg.id);

    this.connections[msg.id].once('open', function () {
        this.log({ what: 'connected', where: msg.id });
    }.bind(this));

    this.connections[msg.id].once('close', function () {
        this.log({ what: 'disconnected', from: msg.id });
        this.emit('disconnect', msg.id);
    }.bind(this));
};

Grid.prototype.disconnected = function (msg) {
    this.candidates = _.without(this.candidates, msg.id);
    if (!this.connections[msg.id]) { return; }
    this.connections[msg.id].close();
    delete this.connections[msg.id];

    if (_.keys(this.connections).length < this.options.connectionsLimit) {
        if (this.candidates.length > 0) {
            this.connected(this.candidates.shift());
        } else {
            // Todo: Ask server for connections
        }
    }
};

Grid.prototype.welcome = function (msg) {
    this.id = this.id || msg.id;
    this.emit('ready', this.id);
};

Grid.prototype.log = function(obj) {
    if (this.signalingChannel.sendRaw) {
        this.signalingChannel.sendRaw(new Message.Log(obj).toArrayBuffer());
    }
};

module.exports = Grid;
