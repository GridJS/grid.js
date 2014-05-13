/* global describe, it */

'use strict';

var should = require('should'),
    sinon = require('sinon'),
    _ = require('lodash'),
    utils = require('./utils.js');

describe('grid', function () {
    it('should be a constructor', function () {
        var Grid = require('../lib/grid.js');
        should.exist(Grid);
        Grid.should.be.instanceof(Function);
    });

    it('should emit ready, when grid server sends id', function (done) {
        var Grid = require('../lib/grid.js');
        var grid = new Grid({ host: 'localhost', port: 31337 });

        grid.on('ready', function (id) {
            should.exist(id);
            id.length.should.eql(36);
            grid.close();
            done();
        });
    });

    it('should be able to take 32 clients', function (done) {
        var Grid = require('../lib/grid.js');

        var grids = _.range(32).map(function () {
            return new Grid({ host: 'localhost', port: 31337 });
        });

        var stb = sinon.stub();
        stb.returns(function () { });
        utils.when(grids, 'ready', function () {
            _.forEach(grids, function (grid) { grid.close(); });
            done();
        });

        grids[3].on('connection', function () { stb()(); });
    });
});
