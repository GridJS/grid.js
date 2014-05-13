/* global describe, it */

'use strict';

var should = require('should'),
    utils = require('./utils.js');

function test(Signal) {
    it('should be a constructor', function () {
        Signal.should.be.instanceof(Function);
    });

    it('should emit open when channel is requested', function (done) {
        var sl = new Signal();
        sl.on('error', done);
        sl.once('open', function () {
            sl.close();
            done();
        });
    });

    it('should emit typed events', function (done) {
        var sl = new Signal();
        sl.on('error', done);
        sl.once('message:welcome', function (message) {
            should.exist(message);
            sl.close();
            done();
        });
    });

    it('should be able to transfer messages', function (done) {
        var c1 = new Signal();
        var c2 = new Signal();

        utils.when([c1, c2], 'message:welcome', function (mw1, mw2) {
            c2.on('message:untyped', function (message, from) {
                from.should.eql(mw1.id);
                message.data.should.eql('Hello!');
                c1.close();
                c2.close();
                done();
            });
            c1.send(mw2.id, 'Hello!');
        });
    });

    it('should broadcast `connected` message', function (done) {
        var c3 = new Signal();
        var c4 = new Signal();

        utils.when([c3, c4], 'message:welcome', function (mw3, mw4) {
            c3.on('message:connected', function (connected3) {
                connected3.id.should.eql(mw4.id);
                c3.close();
                c4.close();
                done();
            });
        });
    });

    it('should broadcast `disconnected` message', function (done) {
        var c3 = new Signal();
        var c4 = new Signal();

        utils.when([c3, c4], 'message:welcome', function (mw3, mw4) {
            c3.on('message:disconnected', function (disconnected3) {
                disconnected3.id.should.eql(mw4.id);
                c3.close();
                done();
            });
            c4.close();
        });
    });

}

describe('signal', function () {

    var SignalLocal = require('../lib/signal-local.js');
    var SignalWS = require('../lib/signal-ws.js');

    describe('local', function () {
        test(SignalLocal);
    });

    describe('websocket', function () {
        test(SignalWS.bind(SignalWS, {
            host: 'localhost',
            port: '31337'
        }));
    });
});
