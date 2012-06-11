var capirona = require("../../");


capirona.run({
	"def loadTest": {
		"run": [
			{
				"load": __dirname + "/tasks"
			},
			{
				"load": __dirname + "/dir"
			}
		]
	}
}).run("loadTest");