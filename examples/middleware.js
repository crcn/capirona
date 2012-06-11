var capirona = require("../");


var script = capirona.make({
	"def timeout/1000 -> hello": {
		"def log -> ./taco/johns -> world": {
			"run": function(target, next) {
				console.log(target.value)
				next();
			}	
		},
		"def taco/johns": {
			"run": function(target, next) {
				console.log("hello taco johns");
				next();
			}
		}
	},
	"def timeout/:ms": {
		"run": function(target, next) {
			console.log("timeout for %s ms", target.data.ms);
			setTimeout(next, Number(target.data.ms));
		}
	},
	"def log": {
		"run": function(target, next) {
			console.log("log...");
			next();
		}
	}
});


script.run("hello/world", "hello");