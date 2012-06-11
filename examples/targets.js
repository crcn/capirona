var capirona = require("../");


var script = capirona.run([{
	"def hello": {
		"run": function(target, next) {
			console.log("hello %s!", target.data.name);
			next();
		}
	}
}, {
	"hello": {
		name: "craig"
	}
}]);

