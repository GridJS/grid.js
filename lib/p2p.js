'use strict';

var Emitter = require('wildemitter');
var P2PConnection = require('./p2p-connection.js');
var _ = require('lodash');

function P2P(options) {
    if(!(this instanceof P2P)) { return new P2P(options); }
    Emitter.call(this);

    this.options = options || {};
    this.signalingChannel = this.options.signalingChannel || require('../lib/signal-ws.js')(this.options);
    this.peers = {};

    this.signalingChannel.once('open', this.emit.bind(this, 'open'));
    this.signalingChannel.on('message', this.dispatch.bind(this));
}

P2P.prototype = new Emitter();

P2P.prototype.close = function close() {
    _(this.callbacks).forEach(function(cb, event) { this.off(event); }.bind(this));
    _(this.peers).forEach(function (connection) {
        connection.close();
    });
};

P2P.prototype.dispatch = function dispatch(message) {
    if (!message.src) { return; }
    var from = message.src;

    if (!this.peers[from]) {
        this.peers[from] = new P2PConnection({
            dest: from,
            signalingChannel: this.signalingChannel,
            incoming: true,
            reliable: this.options.reliable || false
        });
        this.emit('connection', this.peers[from], from);
        this.peers[from].on('close', function () { delete this.peers[from]; }.bind(this));
    }

    var p2p = this.peers[from];
    if (message.data.type && message.data.type !== 'send' && p2p[message.data.type]) {
        p2p[message.data.type].call(p2p, message.data.msg);
    }
};

P2P.prototype.connect = function connect(id) {
    var self = this;
    self.peers[id] = self.peers[id] || new P2PConnection({
        dest: id,
        signalingChannel: this.signalingChannel,
        incoming: false
    });
    return self.peers[id];
};

module.exports = P2P;
