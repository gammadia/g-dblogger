/*jslint node: true, nomen: true, white: true */
module.exports = function (app) {
	'use strict';

	var logger		= app.logger && app.logger.child({component: 'DBLogger'}),
		database	= app.database.use(app.config.get('dblogger:db')),
		extend		= require('xtend'),

		do_log		= function(obj) {
			obj.timestamp = JSON.stringify(new Date());

			database.insert(obj, function (err, body) {
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
