/* global describe, it */

'use strict';

var should = require('should'),
    utils = require('./utils');

describe('grid', function () {
    it('should be a constructor', function () {
        var Grid = require('../lib/grid.js');
        should.exist(Grid);
        Grid.should.be.instanceof(Function);
    });

    var signaling = require('../lib/signal-local.js');

    it('should accept signaling layer', function (done) {
        var grid = require('../lib/grid.js')(signaling);

        grid.signalingChannel.on('ready', done.bind(null, null));
        grid.signalingChannel.on('error', done);
    });
});
