'use strict';

var Emitter = require('wildemitter');
var P2P = require('./p2p.js');

function Grid(signaling, options) {
    if(!(this instanceof Grid)) { return new Grid(options); }

    if (!(signaling instanceof Emitter)) { options = signaling; signaling = undefined; }

    this.options = options || {};
    this.options.signaling = signaling || require('../lib/signal-local.js');

    this.signalingChannel = this.options.signaling({ host: this.options.host, port: this.options.port });
    this.p2p = P2P({ signaling: signaling });
    this.p2p.on('ready', this.emit.bind(this, 'ready'));

    Emitter.call(this);
};

Grid.prototype = new Emitter();

Grid.prototype.send = function send(id, msg) {
    // Should send message without explicit connection to peer
};

module.exports = Grid;
