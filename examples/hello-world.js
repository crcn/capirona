var capirona = require("../");


var script = capirona.make({
	"def hello/:name": {
		"run": function(target, next) {
			console.log("hello %s!", target.name);
			next();
		}
	}
}, "hello/craig");


script.run();