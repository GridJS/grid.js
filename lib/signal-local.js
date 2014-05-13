/*
	LocalStorage signaling server - used in tests
*/

'use strict';

var Emitter = require('wildemitter');
var Message = require('grid-protocol').Messages;
var _ = require('lodash');

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

function createLayer() {
    var clients = {};

    function Local(options) {
        Emitter.call(this);

    	options = options || {};

    	if(!(this instanceof Local)) { return new Local(options); }

    	if (typeof options === 'string') { options = { id: options }; }

    	options.id = options.id || guid();

    	this.options = options;
    	this.id = this.options.id;

        this.on('encodedMessage', function (msg) {
            var message = Message.decode(msg);
            this.emit('message', message, message.src);
        }.bind(this));
    };

    Local.prototype = new Emitter();

    Local.prototype.open = function () {
        for (var clientId in clients) {
            clients[clientId].emit('encodedMessage', (new Message.Connected(this.id)).toArrayBuffer());
        }

        clients[this.id] = this;
        setTimeout(function() {
            this.emit('open');
            this.emit('encodedMessage', (new Message.Welcome(this.id)).toArrayBuffer());
        }.bind(this), 0);

        return this;
    };

    Local.prototype.close = function () {
        _(this.callbacks).forEach(function(cb, event) { this.off(event); }.bind(this));
        delete clients[this.id];
        for (var clientId in clients) {
            clients[clientId].emit('encodedMessage', (new Message.Disconnected(this.id)).toArrayBuffer());
        }
    };

    Local.prototype.send = function (dest, message) {
        if (clients[dest]) {
            clients[dest].emit('encodedMessage', (new Message(dest, message, this.id)).toArrayBuffer());
        }
    };

    return Local;
}

module.exports = createLayer;
