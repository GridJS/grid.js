'use strict';

var Utils = {},
	async = require('async');

Utils.when = function (emitters, event, cb) {
	var tasks = emitters.map(function (emitter) {
		return function (mapCb) {
			emitter.once(event, function () {
				var args = [null].concat(Array.prototype.slice.call(arguments));
				mapCb.apply(null, args);
			});
		};
	});

	async.parallel(tasks, function (err, results) {
		cb.apply(null, results.map(function (r) { return r[0]; }));
	});
};

module.exports = Utils;
