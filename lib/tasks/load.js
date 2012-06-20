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
				return target.value() || target.get().source;
			}
		},
		"message": function(target) {
			return target.get().source;
		},
		"run": function(target, next) {

			var data = target.get();

			var source = data.source,
			cwd        = target.cwd || process.cwd();
			var load;

			if(source.substr(0, 4) == "http") {
				load = loadUrl;
			} else {
				load = loadFile;
				if(source.substr(0, 1) == ".") {
					source = cwd + "/" + source;
				}
				cwd  = path.dirname(source);
			}

			var self = this;


			load(source, outcome.error(next).success(function(task) {
				
				target.caller.runChild(task, target.child({
					cwd: cwd,
					__dirname: cwd,
					__filename: source
				}), outcome.error(next).success(function() {
					next(null, false);
				}));
			}));
		}
	}
};