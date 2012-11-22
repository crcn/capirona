var capirona = require("../");


var script = capirona.run([{
	"def timeout/1000 -> hello": {
		"def log -> ./taco/johns -> world": {
			"run": function(context, next) {
				console.log("hello %s!", context.value())
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
		"run": function(context, next) {
			console.log("timeout for %s ms", this.get("ms"));
			setTimeout(next, Number(this.get("ms")));
		}
	},
	"def log": {
		"run": function(context, next) {
			console.log("log...");
			next();
		}
	}
}]);


script.run("hello/world", "craig", function(err) {
	if(err) console.log(err.stack)
});