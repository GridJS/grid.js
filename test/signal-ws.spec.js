/* global describe, it */

'use strict';

var should = require('should');

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
});
