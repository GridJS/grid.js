'use strict';

var Emitter = require('wildemitter');
var P2PConnection = require('./p2p-connection.js');
var _ = require('lodash');

function P2P(options) {
    if(!(this instanceof P2P)) { return new P2P(options); }
    Emitter.call(this);

    this.options = options || {};
    this.signalingChannel = this.options.signalingChannel || require('../lib/signal-ws.js')();
    this.peers = {};

    this.signalingChannel.open();
    this.signalingChannel.once('open', this.emit.bind(this, 'open'));
    this.signalingChannel.on('message', this.dispatch.bind(this));
}

P2P.prototype = new Emitter();

P2P.prototype.close = function close() {
    this.off();
    _(this.peers).forEach(function (connection) {
        connection.close();
    });
};

P2P.prototype.dispatch = function dispatch(message, from) {
    if (!this.peers[from]) {
        this.peers[from] = new P2PConnection({
            dest: from,
            signalingChannel: this.signalingChannel,
            incoming: true
        });
        this.emit('connection', this.peers[from]);
        this.peers[from].on('close', function () { delete this.peers[from]; });
    }

    var p2p = this.peers[from];
    if (!message.type || !p2p[message.type]) { message = { type: 'send', msg: message }; }
    p2p[message.type].call(p2p, message.msg);
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
