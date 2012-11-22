var _ = require("underscore");

module.exports = {
	"def set": {
		"run": function(context, next) {

			var set = this.get();

			for(var key in set) {
				context.set(key, set[key]);
			}
			
			next(null, false);
		}
	}
}