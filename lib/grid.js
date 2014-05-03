var Emitter = require('wildemitter');

function Grid(options) {
    if(!(this instanceof Grid)) { return new Grid(options); }

    this.options = options || {};
    
    Emitter.call(this);
};

Grid.prototype = new Emitter;

Grid.prototype.send = function send(id, msg) {
    // Should send message without explicit connection to peer
};

module.exports = Grid;