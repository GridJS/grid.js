/* global describe, it */

'use strict';

var should = require('should'),
    sinon = require('sinon'),
    utils = require('./utils.js');

describe('grid', function () {
    it('should be a constructor', function () {
        var Grid = require('../lib/grid.js');
        should.exist(Grid);
        Grid.should.be.instanceof(Function);
    });

    it('should emit ready, when grid server sends id', function (done) {
        var Grid = require('../lib/grid.js');
        var grid = new Grid({ signaling: require('../lib/signal-local.js')(), id: 'g1' });

        grid.on('ready', function (id) {
            should.exist(id);
            id.should.eql('g1');
            grid.close();
            done();
        });
    });

    it('should connect to at most 3 incoming clients', function (done) {
        var Grid = require('../lib/grid.js');

        var sl = require('../lib/signal-local.js')();

        var grids = [0, 1, 2, 3, 4].map(function (i) {
            return new Grid({ signaling: sl });
        });

        var stb = sinon.stub();
        stb.returns(function () { });
        utils.when(grids, 'ready', function (id0, id1, id2, id3) {
            stb.onCall(2).returns(function () {
                Object.keys(grids[0].connections).should.eql([ id1, id2, id3 ]);
                done();
            });
        });

        grids[3].on('connection', function () { stb()(); });
    });

        // it.only('should recover from neighbourhood connections failure', function (done) {
        //     var Grid = require('../lib/grid.js');
        //     var grids = [0, 1, 2, 3, 4].map(function () {
        //         return new Grid({ host: 'localhost', port: '31337' });
        //     });

        //     var stb = sinon.stub();
        //     stb.returns(function () { });

        //     utils.when(grids, 'ready', function (id0) {
        //         stb.onCall(2).returns(function(id) {
        //             id.should.eql(id0);
        //             done();
        //         });

        //         grids[1].close();
        //         grids[2].close();
        //         grids[3].close();
        //         grids[3].on('connection', function(conn, id) { stb()(id); });
        //     });
        // });
});
