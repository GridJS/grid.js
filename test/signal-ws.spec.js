/* global describe, it */

'use strict';

var should = require('should'),
    utils = require('./utils');

describe('signal-ws', function () {

    var opts = { host: 'localhost', port: 31337 };

    it('should be a constructor', function () {
    	var SignalWs = require('../lib/signal-ws.js');
    	should.exist(SignalWs);
    	SignalWs.should.be.instanceof(Function);
    });

    it('should emit open when channel is requested', function (done) {
        var sl = require('../lib/signal-ws.js')(opts);
        sl.open();
        sl.once('open', function () {
            sl.open();
            sl.once('open', done.bind(null, null));
        });
        sl.on('error', done);
    });

    it('should receive WELCOME message from grid', function (done) {
        var sl = require('../lib/signal-ws.js');
    	var c1 = sl(opts).open();

    	c1.on('message', function(msg) {
            msg.type.should.eql('WELCOME');
            c1.close();
            done();
    	});
    });

    it('should receive custom message from other clients', function (done) {
        var sl = require('../lib/signal-ws.js');
        var c3 = sl(opts).open();
        var c4 = sl(opts).open();

        utils.when([c3, c4], 'message', function (w3, w4) {
            w3 = w3[0];
            w4 = w4[0];
            c3.on('message', function (helloMsg) {
                helloMsg.src.should.eql(w4.id);
                helloMsg.data.should.eql('Hello!');
                c3.close();
                c4.close();
                done();
            });
            c4.send(w3.id, 'Hello!');
        });
    });
});
