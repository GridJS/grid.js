/* global describe, it */

'use strict';

var should = require('should');

function test(signal) {
    it('should be a constructor', function () {
        var SignalLocal = require('../lib/signal-local.js');
        should.exist(SignalLocal);
        SignalLocal.should.be.instanceof(Function);
    });

    it('should emit open when channel is requested', function (done) {
        var sl = require('../lib/signal-local.js')();
        var c = sl().open();
        c.open();
        c.once('open', done.bind(null, null));
    });

    it('should be able to transfer messages', function (done) {
        var sl = require('../lib/signal-local.js')();
        var c1 = sl('c1').open();
        var c2 = sl('c2').open();

        c2.on('message', function (message, from) {
            if (message.type) { return; }

            from.should.eql('c1');
            message.data.should.eql('Hello!');
            c1.close();
            c2.close();
            done();
        });

        c1.on('open', function () {
            c1.send('c2', 'Hello!');
        });
    });

    it('should broadcast `connected` message', function (done) {
        var sl = require('../lib/signal-local.js')();
        var c3 = sl('c3').open();

        var c4 = sl('c4');
        c3.on('message', function(msg) {
            if (msg.type === 'CONNECTED') {
                msg.id.should.eql('c4');
                c3.close();
                c4.close();
                done();
            }
        });
        c4.open();

    });

    it('should broadcast `disconnected` message', function (done) {
        var sl = require('../lib/signal-local.js')();
        var c5 = sl('c5').open();
        var c6 = sl('c6').open();

        c5.on('message', function(msg) {
            if (msg.type === 'DISCONNECTED') {
                msg.id.should.eql('c6');
                c5.close();
                done();
            }
        });

        c6.close();
    });
}

describe.only('signal', function () {

    describe('local', function () {
        test(require('../lib/signal-local.js'));
    });

    describe('websocket', function () {
        test(require('../lib/signal-ws.js'));
    });
});
