module.exports = {
	"def log": {
		"params": {
			"text": function(target) {
				return target.value() || target.get().text;
			}
		},
		"run": function(context, next) {
			console.log(this.get().text || context);
			next();
		}
	}
}