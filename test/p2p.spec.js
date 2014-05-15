/* global describe, it */

'use strict';

var should = require('should'),
    utils = require('./utils');

var opts = { host: 'localhost', port: 31337 };

describe('p2p', function () {
    it('should be a constructor', function () {
    	require('../lib/p2p.js').should.be.instanceof(Function);
    });

    it('should open and close p2p layer', function (done) {
        var p2p = require('../lib/p2p.js')(opts);
        p2p.on('open', function () {
            p2p.close();
            done();
        });
        p2p.signalingChannel.on('error', done);
    });

    it('should be able to send messages from destanation', function (done) {
        var p1 = require('../lib/p2p.js')(opts);
        var p2 = require('../lib/p2p.js')(opts);

        p2.on('connection', function (conn) {
            conn.on('open', function () {
                conn.send('Hello!');
            });
        });

        utils.when([p1.signalingChannel, p2.signalingChannel], 'message:welcome', function (arg1, arg2) {
            var conn = p1.connect(arg2.id);
            conn.on('open', function () {
                conn.on('message', function (msg) {
                    p1.close();
                    p2.close();
                    done();
                });
            });
        });
    });

    it('should be able to send messages to destanation', function (done) {
        var p3 = require('../lib/p2p.js')(opts);
        var p4 = require('../lib/p2p.js')(opts);

        p4.on('connection', function (conn) {
            conn.on('message', function (msg) {
                msg.data.should.be.eql('Hello!');
                p3.close();
                p4.close();
                done();
            });
        });

        utils.when([p3.signalingChannel, p4.signalingChannel], 'message:welcome', function (arg1, arg2) {
            var conn = p3.connect(arg2.id);
            conn.on('open', function () {
                conn.send('Hello!');
            });
        });
    });

    it('should work, when malformed messages are passed');
});
