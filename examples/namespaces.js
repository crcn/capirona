var capirona = require("../");


var script = capirona.make({
	"def hello": {
		"def world": {
			"run": function(target, next) {
				console.log("hello world!");
				next();
			}	
		},
		"def taco/johns": {
			"run": function(target, next) {
				console.log("hello taco johns");
				next();
			}
		}
	}
}, "hello/world", "hello/taco/johns");


script.run();