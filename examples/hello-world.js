var capirona = require("../");


var script = capirona.run({
	"def hello/:name": {
		"run": function(context, next) {
			console.log("hello %s!", this.get("name"));
			next();
		}
	}
});


script.run("hello/craig", function(err) {
	if(err) console.error(err.stack)
});