/* global describe, it */

'use strict';

var should = require('should'),
    utils = require('./utils.js');

describe('grid', function () {
    it('should be a constructor', function () {
        var Grid = require('../lib/grid.js');
        should.exist(Grid);
        Grid.should.be.instanceof(Function);
    });

    it('should emit ready, when grid server sends id', function (done) {
        var Grid = require('../lib/grid.js');
        var grid = new Grid({ host: 'localhost', port: '31337' });

        grid.on('ready', function (id) {
            should.exist(id);
            grid.close();
            done();
        });
    });

    it('should maintain at most connectionsLimit x 2 for client', function (done) {
        var Grid = require('../lib/grid.js');
        var grids = [0, 1, 2, 3, 4, 5].map(function () {
            return new Grid({ host: 'localhost', port: '31337' });
        });

        utils.when(grids, 'ready', function () {
            done();
        });
    });

    it('should recover from neighbourhood connections failure');
});
