/* global describe, it */

'use strict';

var should = require('should');

describe('grid-local', function () {
    it('should be a constructor', function () {
    	var GridLocal = require('../lib/grid-local.js');
    	should.exist(GridLocal);
    	GridLocal.should.be.instanceof(Function);
    });

    it('should be able to transfer messages', function (done) {
    	var GridLocal = require('../lib/grid-local.js');
    	var c1 = GridLocal('c1');
    	var c2 = GridLocal('c2');
    	c2.on('message', function(message) {
    		message.should.eql('Hello!');
    		done();
    	})
    	c1.send('c2', 'Hello!');
    });
});