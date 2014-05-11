/* global describe, it */

'use strict';

var should = require('should');

describe('signal-local', function () {
    it('should be a constructor', function () {
    	var SignalLocal = require('../lib/signal-local.js');
    	should.exist(SignalLocal);
    	SignalLocal.should.be.instanceof(Function);
    });

    it('should emit open when channel is requested', function (done) {
        var sl = require('../lib/signal-local.js')();
        sl.open();
        sl.once('open', function () {
            sl.open();
            sl.once('open', done.bind(null, null));
        });
        sl.on('error', done);
    });

    it('should be able to transfer messages', function (done) {
        var sl = require('../lib/signal-local.js');
    	var c1 = sl('c1').open();
    	var c2 = sl('c2').open();

    	c2.on('message', function (message, from) {
            from.should.eql('c1');
            message.should.eql('Hello!');
            c1.close();
            c2.close();
            done();
    	});

    	c1.on('open', function () {
    		c1.send('c2', 'Hello!');
    	});
    });

    it('should broadcast `connected` message', function (done) {
        var sl = require('../lib/signal-local.js');
        var c3 = sl('c3').open();

        var c4 = sl('c4');
        c3.on('connected', function(id) {
            id.should.eql('c4');
            c3.close();
            c4.close();
            done();
        });
        c4.open();

    });

    it('should broadcast `disconnected` message', function (done) {
        var sl = require('../lib/signal-local.js');
        var c5 = sl('c5').open();
        var c6 = sl('c6').open();

        c5.once('disconnected', function(id) {
            id.should.eql('c6');
            c5.close();
            done();
        });

        c6.close();
    });
});
