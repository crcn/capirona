var _ = require("underscore");

module.exports = {
	"def defaults": {
		"run": function(context, next) {
			_.defaults(this.get(), context.get());
			next(null, false);
		}
	}
}