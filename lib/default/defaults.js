var _ = require("underscore");

module.exports = {
	"def defaults": {
		"run": function(target, next) {
			target.caller.stopTraversing();
			_.defaults(target.parent.data, target.data);
			next(null, false);
		}
	}
}