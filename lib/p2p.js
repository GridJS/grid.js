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
        self.emit('ready');
    });

    this.signalingChannel.on('offer', function (offer, from) {
        console.log('Offer from ' + from);
        var peerConnection = self.peers[from];
        if (peerConnection) { return peerConnection; }

        var peer = self.peers[from] = new P2PConnection(self.id, from);
        peer.accept(offer);

        peer.on('message', self.emit.bind(self, 'message'));

        var conn = self.signalingChannel.connect(from);
        conn.on('open', function () {
            peer.answer(conn);
        });
    });

    this.signalingChannel.on('icecandidate', function (candidate, from) {
        var peer = self.peers[from];
        if (!peer) { console.log('No offer was recieved from ' + from); return; }
        console.log('ICE Candidate from ' + from);
        peer.peerConnection.addIceCandidate(new webrtc.IceCandidate(JSON.parse(candidate)));
    });

    this.signalingChannel.on('answer', function (answer, from) {
        console.log('Answer from ' + from);
        self.emit('answer-' + from, answer);
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
        self.once('answer-' + id, function (answer) {
            peer.peerConnection.setRemoteDescription(new webrtc.SessionDescription(JSON.parse(answer)));
        });
    });

    conn.on('close', function () {
        delete self.peers[id];
    });

    return peer;
};

function P2PConnection(src, dst) {
    if(!(this instanceof P2PConnection)) { return new P2PConnection(src, dst); }
    this.src = src;
    this.dst = dst;
    Emitter.call(this);
}

P2PConnection.prototype = new Emitter();

P2PConnection.prototype.send = function send(msg) {
    this.sendChannel.send(msg);
};

P2PConnection.prototype.accept = function accept(offer) {
    var self = this;
    offer = new webrtc.SessionDescription(JSON.parse(offer));
    self.peerConnection = new webrtc.PeerConnection(require('./p2p-iceServers.js'), { optional: [ {RtpDataChannels: true} ] });
    self.peerConnection.ondatachannel = function (event) {
        self.receiveChannel = event.channel;
        self.receiveChannel.onmessage = function (event) {
            self.emit('message', event.data);
        };
    };
    self.peerConnection.setRemoteDescription(offer);
};

P2PConnection.prototype.answer = function answer(signalingConnection) {
    var self = this;

    self.peerConnection.onicecandidate = function (e) {
        if (!e.candidate) { console.error('Failed to get ICE candidate!', e); return; }
        signalingConnection.send('icecandidate', JSON.stringify(e.candidate));
        self.peerConnection.onicecandidate = null;
    };

    self.peerConnection.createAnswer(function (answer) {
        self.peerConnection.setLocalDescription(answer);
        signalingConnection.send('answer', JSON.stringify(answer));
    }, self.emit.bind(self, 'error'));
};

P2PConnection.prototype.offer = function offer(signalingConnection) {
    var self = this;
    this.peerConnection = new webrtc.PeerConnection(require('./p2p-iceServers.js'), { optional: [ {RtpDataChannels: true} ] });
    this.sendChannel = this.peerConnection.createDataChannel('sendDataChannel', { reliable: false });
    this.sendChannel.onopen = function () {
        self.emit('ready');
    };
    this.peerConnection.ondatachannel = function () {
        console.log('Offer Open');
    };

    this.peerConnection.onicecandidate = function (e) {
        if (!e.candidate) { console.error('Failed to get ICE candidate!', e); return; }
        signalingConnection.send('icecandidate', JSON.stringify(e.candidate));
        self.peerConnection.onicecandidate = null;
    };

    this.peerConnection.createOffer(function (offer) {
        self.peerConnection.setLocalDescription(offer);
        signalingConnection.send('offer', JSON.stringify(offer));
    }, self.emit.bind(self, 'error'));
};

module.exports = P2P;
