var capirona = require("../../");


capirona.make({
	"def loadTest": {
		"run": {
			"load": __dirname + "/tasks"
		}
	}
}, "loadTest");