'use strict';

var Emitter = require('wildemitter');
var P2P = require('./p2p.js');
var Message = require('grid-protocol').Messages;

function Grid(signaling, options) {
    if(!(this instanceof Grid)) { return new Grid(options); }
    Emitter.call(this);

    if (!(signaling instanceof Emitter)) { options = signaling; signaling = undefined; }

    this.options = options || {};
    this.options.signaling = signaling || require('../lib/signal-ws.js');

    this.signalingChannel = this.options.signaling(this.options);

    this.p2p = P2P({ signalingChannel: this.signalingChannel });
    this.p2p.on('open', this.emit.bind(this, 'open'));

    this.signalingChannel.on('message', function (msg) {
        if (msg.type === 'WELCOME') {
            this.id = this.id || msg.id;
            this.emit('ready', this.id);
        }
    }.bind(this));
}

Grid.prototype = new Emitter();

Grid.prototype.log = function(obj) {
    this.signalingChannel.sendRaw(undefined, Message.Log(obj));
};

module.exports = Grid;
