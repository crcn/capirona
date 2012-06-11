var request = require("request"),
outcome     = require("outcome"),
fs          = require("fs"),
path        = require("path"),
Expression  = require("../expression"),
loadTasks   = require("../load/loadTasks");


function loadUrl(source, next) {
	request(source, outcome.error(next).success(function(response, body) {
		next(null, JSON.parse(body));
	}));
}

function loadFile(source, next) {

	fs.stat(source, function(err, stat) {

		if(!stat || !stat.isDirectory()) {
			return next(null, require(source));
		}

		next(null, loadTasks(source));
	});

}



module.exports = {
	"def load": {
		"params": {
			"source": function(target) {
				return target.value || target.data.source;
			}
		},
		"run": function(target, next) {
			var source = target.data.source,
			cwd        = target.cwd || process.cwd();
			var load;

			if(source.substr(0, 4) == "http") {
				load = loadUrl;
			} else {
				load = loadFile;
				cwd  += "/" + path.dirname(source);
			}

			var self = this;

			load(source, outcome.error(next).success(function(task) {
				target.caller.stopTraversing();
				target.parser.make(target.caller.addChild(Expression.parse(task)), {
					cwd: cwd
				}, next);
			}));
		}
	}
};