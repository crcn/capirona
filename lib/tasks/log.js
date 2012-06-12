module.exports = {
	"def log": {
		"params": {
			"text": function(target) {
				return target.value || target.data.text;
			}
		},
		"run": function(target, next) {
			console.log(target.data.text);
			next();
		}
	}
}