var _ = require("underscore");

module.exports = {
	"def defaults": {
		"run": function(target, next) {
			_.defaults(target.parent.data, target.data);
			next(null, false);
		}
	}
}