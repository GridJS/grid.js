/* global describe, it */

'use strict';

var should = require('should');

describe('signal-local', function () {
    it('should be a constructor', function () {
    	var SignalLocal = require('../lib/signal-local.js');
    	should.exist(SignalLocal);
    	SignalLocal.should.be.instanceof(Function);
    });

    it('should emit ready when initialized', function (done) {
        var sl = require('../lib/signal-local.js')();
        sl.on('ready', done.bind(null, null));
        sl.on('error', done);
    });

    it('should be able to transfer messages', function (done) {
        var sl = require('../lib/signal-local.js');
    	var c1 = sl('c1');
    	var c2 = sl('c2');

    	c2.on('message', function(message) {
    		message.should.eql('Hello!');
    		done();
    	});

    	c1.on('ready', function () {
    		var connection = c1.connect('c2');
    		connection.send('Hello!');
    	});
    });
});
