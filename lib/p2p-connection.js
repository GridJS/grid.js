'use strict';

var Emitter = require('wildemitter');
var webrtc = require('./webrtc-shim.js');

function P2PConnection(options) {
    if(!(this instanceof P2PConnection)) { return new P2PConnection(options); }
    Emitter.call(this);

    this.options = options || {};
    this.dest = this.options.dest;
    this.signalingChannel = this.options.signalingChannel;

    if (!this.options.incoming) {
        this.startNegotiating();
    }
}

P2PConnection.prototype = new Emitter();

P2PConnection.prototype.close = function () {
    if (this.channel) {
        this.channel.close();
    } else {
        this.emit('close');
    }
};

P2PConnection.prototype.startNegotiating = function startNegotiating() {
    var self = this;

    this.peerConnection = new webrtc.PeerConnection(require('./p2p-iceServers.js'), { optional: [ {RtpDataChannels: true} ] });

    this._setupChannel(
        this.peerConnection.createDataChannel('sendDataChannel', { reliable: this.options.reliable })
    );

    this.peerConnection.onicecandidate = function (e) {
        if (!e.candidate) { console.error('Failed to get ICE candidate!', e); return; }
        self.signalingChannel.send(self.dest, { type: 'icecandidate', msg: JSON.stringify(e.candidate) });
        self.peerConnection.onicecandidate = null;
    };

    this.peerConnection.createOffer(function (offer) {
        self.peerConnection.setLocalDescription(offer);
        self.signalingChannel.send(self.dest, { type: 'offer', msg: JSON.stringify(offer) });
    }, self.emit.bind(self, 'error'));
};

P2PConnection.prototype._setupChannel = function (channel) {
    this.channel = channel;
    this.channel.onmessage = this.emit.bind(this, 'message');
    this.channel.onopen = this.emit.bind(this, 'open');
    this.channel.onclose = this.emit.bind(this, 'close');
};

P2PConnection.prototype._onDataChannel = function (event) {
    this._setupChannel(event.channel);
};

P2PConnection.prototype.icecandidate = function (candidate) {
    var iceCandidate = new webrtc.IceCandidate(JSON.parse(candidate));
    this.peerConnection.addIceCandidate(iceCandidate);
};

// offer message recieved, need to send answer
P2PConnection.prototype.offer = function (offer) {
    var self = this;
    offer = new webrtc.SessionDescription(JSON.parse(offer));
    self.peerConnection = new webrtc.PeerConnection(require('./p2p-iceServers.js'), { optional: [ {RtpDataChannels: true} ] });
    self.peerConnection.ondatachannel = self._onDataChannel.bind(self);
    self.peerConnection.setRemoteDescription(offer);

    self.peerConnection.onicecandidate = function (e) {
        if (!e.candidate) { console.error('Failed to get ICE candidate!', e); return; }
        self.signalingChannel.send(self.dest, { type: 'icecandidate', msg: JSON.stringify(e.candidate) });
        self.peerConnection.onicecandidate = null;
    };

    self.peerConnection.createAnswer(function (answer) {
        self.peerConnection.setLocalDescription(answer);
        self.signalingChannel.send(self.dest, { type: 'answer', msg: JSON.stringify(answer) });
    }, self.emit.bind(self, 'error'));

};

P2PConnection.prototype.answer = function (answer) {
    answer = new webrtc.SessionDescription(JSON.parse(answer));
    this.peerConnection.setRemoteDescription(answer);
};

P2PConnection.prototype.send = function send(msg) {
    if (!this.channel) { throw new Error('Connection is closed or not yet established'); }
    this.channel.send(msg);
};

module.exports = P2PConnection;
