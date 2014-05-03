'use strict';

var Utils = {},
	async = require('async');

Utils.when = function (emitters, event, cb) {
	var tasks = emitters.map(function (emitter) { 
		return function (cb) {
			emitter.on(event, function () {
				var args = [null].concat(Array.prototype.slice.call(arguments));
				cb.apply(null, args);
			});
		};
	});

	async.parallel(tasks, function (err, results) {
		cb.apply(null, results);
	});
};

module.exports = Utils;