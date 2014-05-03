'use strict';

var Emitter = require('wildemitter');
var webrtc = require('./webrtc-shim.js');

function P2P(options) {
    if(!(this instanceof P2P)) { return new P2P(options); }

    this.options = options || {};
    this.options.signaling = this.options.signaling || require('../lib/signal-local.js');
    this.signalingChannel = this.options.signaling({ host: this.options.host, port: this.options.port });
    this.peers = {};

    var self = this;
    this.signalingChannel.on('ready', function (id) {
        self.id = id;
    });

    this.signalingChannel.on('offer', function (offer) {
        var peerConnection = self.peers[from];

        if (peerConnection) { return peerConnection; }

        var peer = self.peers[from] = new P2PConnection(self.id, this.src);
        var conn = self.signalingChannel.connect(this.src);
        conn.on('open', function () {
            peer.accept(offer, conn);
        });
    });

    this.signalingChannel.on('answer', function (answer) {
        self.signalingChannel.emit('answer-' + this.source.id, answer);
    });

    Emitter.call(this);
}

P2P.prototype = new Emitter();

P2P.prototype.connect = function connect(id) {
    var self = this;
    var conn = this.signalingChannel.connect(id);
    var peer = self.peers[id] = new P2PConnection(self.id, id);

    conn.on('open', function () {
        peer.offer(conn);
        self.signalingChannel.on('answer-' + id, function (answer) {
            self.peerConnection.setRemoteDescription(answer);
        });
    });

    conn.on('close', function () {
        delete self.peers[id];
    });

    return peer;
};

P2P.prototype.send = function send(id, msg) {
    // Should send message without explicit connection to peer
};

function P2PConnection(src, dst) {
    if(!(this instanceof P2PConnection)) { return new P2PConnection(src, dst); }
    this.src = src;
    this.dst = dst;
    Emitter.call(this);
}

P2PConnection.prototype = new Emitter();

P2PConnection.prototype.accept = function accept(offer, signalingConnection) {
    var self = this;
    offer = new SessionDescription(JSON.parse(offer));
    self.peerConnection = new webrtc.PeerConnection(require('./p2p-iceServers.js'), { optional: [ {RtpDataChannels: true} ] });
    self.peerConnection.setRemoteDescription(offer);

    self.peerConnection.createAnswer(function (answer) {
        self.peerConnection.setLocalDescription(answer);
        signalingConnection.send('answer', JSON.stringify(answer));
    }, errorHandler, constraints);
};

P2PConnection.prototype.offer = function offer(signalingConnection) {
    var self = this;
    this.peerConnection = new webrtc.PeerConnection(require('./p2p-iceServers.js'), { optional: [ {RtpDataChannels: true} ] });
    
    this.peerConnection.onicecandidate = function (e) {
        if (!e.candidate) { console.error('Failed to get ICE candidate!', e); return; }
        signalingConnection.send('icecandidate', JSON.stringify(e.candidate));
        self.peerConnection.onicecandidate = null;
    };

    this.peerConnection.createOffer(function (offer) {
        self.peerConnection.setLocalDescription(offer);
        signalingConnection.send('offer', JSON.stringify(offer));
    }, errorHandler, constraints);
};

module.exports = P2P;