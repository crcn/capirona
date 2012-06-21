var _ = require("underscore");

module.exports = {
	"def set": {
		"run": function(target, next) {
			
			for(var i = target.keys.length; i--;) {
				target.set(target.keys[i], target.get(target.keys[i]));
			}
			
			next(null, false);
		}
	}
}