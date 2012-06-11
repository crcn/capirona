module.exports = {
	"def log": {
		"params": {
			"text": function(target) {
				return target.value || target.text;
			}
		},
		"run": function(target, next) {
			console.log(target.data.text);
			next();
		}
	}
}