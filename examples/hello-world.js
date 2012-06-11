var capirona = require("../");


var script = capirona.run({
	"def hello/:name": {
		"run": function(target, next) {
			console.log("hello %s!", target.data.name);
			next();
		}
	}
});


script.run("hello/craig");