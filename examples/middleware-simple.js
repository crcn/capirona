var capirona = require("../");


var script = capirona.run([{
	"def hello": {
		"def ./taco/johns -> world": {
			"run": function(target, next) {
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
}]);


script.run("hello/world", function(err) {
	if(err) console.log(err.stack)
});