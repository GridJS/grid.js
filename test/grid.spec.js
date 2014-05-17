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

    it('should provide duplex communication', function (done) {
        var Grid = require('../lib/grid.js');

        var grids = _.range(2).map(function () {
            return new Grid({ host: 'localhost', port: 31337 });
        });

        utils.when(grids, 'ready', function (id1, id2) {
            grids[0].on('connection', function (conn) {
                conn.on('message', function (msg) {
                    msg.data.should.eql('Hello Grid!');
                    conn.send('Why hello there!');
                });
            });
            grids[1].on('connection', function (conn) {
                conn.on('open', function () {
                    conn.send('Hello Grid!');
                });
                conn.on('message', function (msg) {
                    msg.data.should.eql('Why hello there!');
                    _.forEach(grids, function (grid) { grid.close(); });
                    done();
                })
            });
        });
    });

    it('should be able to take 32 clients', function (done) {
        var Grid = require('../lib/grid.js');

        var grids = _.range(32).map(function () {
            return new Grid({ host: 'localhost', port: 31337 });
        });

        utils.when(grids, 'ready', function () {
            _.forEach(grids, function (grid) { grid.close(); });
            done();
        });
    });

    it('should maintain connectivity, when some clients are disconnected', function (done) {
        var Grid = require('../lib/grid.js');

        var grids = _.range(5).map(function () {
            return new Grid({ host: 'localhost', port: 31337 });
        });

        utils.when(grids, 'ready', function (id1, id2, id3, id4, id5) {
            grids[3].on('connection', function (conn, id) {
                if (id !== id1) { return; }

                // Kill 2 - 4 nodes, so 1 node will be disconnected from 5

                grids[1].close();
                grids[2].close();
                grids[3].close();

                // After connections recovery id5 should get connection from 1 node

                grids[4].on('connection', function (conn, id) {
                    if (id === id1) {
                        _.forEach(grids, function (grid) { grid.close(); });
                        done();
                    }
                });
            });
        });
    });
});
