module.exports = {
	"def log": {
		"params": {
			"text": function(target) {
				return target.value() || target.get().text;
			}
		},
		"run": function(target, next) {
			console.log(target.get().text);
			next();
		}
	}
}