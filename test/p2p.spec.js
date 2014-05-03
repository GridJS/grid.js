/* global describe, it */

'use strict';

var should = require('should'),
    utils = require('./utils');

describe('p2p', function () {
    it('should be a constructor', function () {
    	var P2P = require('../lib/p2p.js');
    	should.exist(P2P);
    	P2P.should.be.instanceof(Function);
    });

    var opts = { signaling: require('../lib/signal-local.js') };

    it('should accept signaling layer', function (done) {
        var p2p = require('../lib/p2p.js')(opts);

        p2p.signalingChannel.on('ready', done.bind(null, null));
        p2p.signalingChannel.on('error', done);
    });

    it('should be able to send messages', function (done) {
        var p1 = require('../lib/p2p.js')(opts);
        var p2 = require('../lib/p2p.js')(opts);

        p2.on('message', function (msg) {
            msg.should.eql('Hello!');
            done();
        });

        utils.when([p1, p2], 'ready', function (id1, id2) {
            var conn = p1.connect(p2.id);
            conn.on('ready', function () {
                conn.send('Hello!');
            });
        });
    });
});