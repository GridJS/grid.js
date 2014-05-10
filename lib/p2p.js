'use strict';

var Emitter = require('wildemitter');
var P2PConnection = require('./p2p-connection.js');

function P2P(options) {
    if(!(this instanceof P2P)) { return new P2P(options); }

    this.options = options || {};
    this.options.signaling = this.options.signaling || require('../lib/signal-ws.js');
    this.signalingChannel = this.options.signaling({ host: this.options.host, port: this.options.port });
    this.peers = {};

    var self = this;
    this.signalingChannel.on('ready', function (id) {
        self.id = id;
        self.emit('ready');
    });

    this.signalingChannel.on('message', this.dispatch.bind(this));

    Emitter.call(this);
}

P2P.prototype = new Emitter();

P2P.prototype.dispatch = function dispatch(message, from) {

    // console.log('DISPATCH ' + message.type + ' from ' + from);

    if (!this.peers[from]) {
        var conn = this.signalingChannel.connect(from);
        this.peers[from] = new P2PConnection(this.id, from, conn);
        this.emit('connection', this.peers[from]);
        this.peers[from].on('close', function () { delete this.peers[from]; });
    }

    var p2p = this.peers[from];
    if (!message.type) { message = { type: 'message', msg: message }; }
    p2p[message.type].call(p2p, message.msg);
};

P2P.prototype.connect = function connect(id) {
    var self = this;
    var conn = this.signalingChannel.connect(id);
    var peer = self.peers[id] = new P2PConnection(self.id, id, conn, true);
    return peer;
};

module.exports = P2P;
