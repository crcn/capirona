var _ = require("underscore");

module.exports = {
	"def set": {
		"run": function(target, next) {
			var data = target.get();
			for(var key in data) {
				target.set(key, data[key]);
			}
			next(null, false);
		}
	}
}