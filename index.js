/*jslint node: true, nomen: true, white: true */
module.exports = function (app) {
	'use strict';

	var logger		= app.logger && app.logger.child({component: 'DBLogger'}),
        bucket      = app.database.get(),
		key	        = null,
		extend		= require('xtend'),

		do_log		= function(obj) {
            key = app.database.getKey();

			obj.timestamp = JSON.stringify(new Date());

			bucket.insert(key, obj, function (err, body) {
				if (err) {
					logger.error('Unable to log to databse', {data: obj});
				}
			});
		},

		dblogger	= {
			makeLogger: function(base) {
				base = base || {};

				return function(obj) {
					do_log(extend({}, base, obj || {}));
				};
			}
		};

    return dblogger;
};