/* global describe, it */

'use strict';

var should = require('should');

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
            done();
        });
    });
});
