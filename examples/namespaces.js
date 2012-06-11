var capirona = require("../");


var script = capirona.run({
	"def hello": {
		"def world": {
			"run": function(target, next) {
				console.log("hello world!");
				setTimeout(next, 500);
			}	
		},
		"def taco/johns": {
			"run": function(target, next) {
				console.log("hello taco johns");
				setTimeout(next, 500);
			}
		}
	}
});


script.run("hello/world").run("hello/taco/johns");