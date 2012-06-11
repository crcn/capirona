var request = require("request"),
outcome = require("outcome"),
fs = require("fs");


function loadUrl(source, next) {
	request(source, outcome.error(next).success(function(response, body) {
		next(null, JSON.parse(body));
	}));
}

function loadFile(source, next) {
	next(null, require(source));
}



module.exports = {
	"def load": {
		"params": {
			"source": function(target) {
				return target.value || target.data.source;
			}
		},
		"run": function(target, next) {
			var source = target.data.source;
			var load;

			if(source.substr(0, 4) == "http") {
				load = loadUrl;
			} else {
				load = loadFile;
			}

			load(source, outcome.error(next).success(function(task) {
				target.parser.make(task, next);
			}));
		}
	}
};