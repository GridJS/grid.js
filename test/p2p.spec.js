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

    it('should accept signaling layer', function (done) {
        var p2p = require('../lib/p2p.js')({ signalingChannel: signaling('p') });
        p2p.on('open', function () {
            p2p.close();
            done();
        });
        p2p.signalingChannel.on('error', done);
    });

    // it('should return incoming connection, when connecting to id, that connected to us', function (done) {
    //     done('Failed for now');
    // });

    var signaling = require('../lib/signal-local.js');

    it('should be able to send messages from destanation', function (done) {
        var p1 = require('../lib/p2p.js')({ signalingChannel: signaling('p1') });
        var p2 = require('../lib/p2p.js')({ signalingChannel: signaling('p2') });

        p2.on('connection', function (conn) {
            conn.on('open', function () {
                conn.send('Hello!');
            });
        });

        utils.when([p1, p2], 'open', function () {
            var conn = p1.connect('p2');
            conn.on('open', function () {
                conn.on('message', function (msg) {
                    msg.data.should.be.eql('Hello!');
                    p1.close();
                    p2.close();
                    done();
                });
            });
        });
    });

    it('should be able to send messages to destanation', function (done) {
        var p3 = require('../lib/p2p.js')({ signalingChannel: signaling('p3') });
        var p4 = require('../lib/p2p.js')({ signalingChannel: signaling('p4') });

        p4.on('connection', function (conn) {
            conn.on('message', function (msg) {
                msg.data.should.be.eql('Hello!');
                p3.close();
                p4.close();
                done();
            });
        });

        utils.when([p3, p4], 'open', function () {
            var conn = p3.connect('p4');
            conn.on('open', function () {
                conn.send('Hello!');
            });
        });
    });

    var ws = require('../lib/signal-ws.js');

    it('should establish connection with signal-ws', function (done) {
        var p5 = require('../lib/p2p.js')({ signalingChannel: ws({ host: 'localhost', port: 31337 }) });
        var p6 = require('../lib/p2p.js')({ signalingChannel: ws({ host: 'localhost', port: 31337 }) });

        utils.when([p5.signalingChannel, p6.signalingChannel], 'message', function (w5, w6) {
            var id5 = w5[0].id, id6 = w6[0].id;
            p5.on('connection', function(conn, id) {
                id.should.eql(id6);
                conn.on('message', function (msg) {
                    msg.data.should.eql('Hello!');
                    p5.close();
                    p6.close();
                    done();
                });
            });
            var conn = p6.connect(id5);
            conn.on('open', function () {
                conn.send('Hello!');
            });
        });
    });

});
