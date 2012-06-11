module.exports = {
	"def log": {
		"run": function(target, next) {
			console.log(target.value || target.text);
			next();
		}
	}
}