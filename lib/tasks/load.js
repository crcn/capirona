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
		"run": function(context, next) {

			var data, source, cwd, load, self = this;

			data = this.get();

			source  = data.source;
			cwd     = this.cwd || process.cwd();

			if(source.substr(0, 4) == "http") {
				load = loadUrl;
			} else {
				load = loadFile;
				if(source.substr(0, 1) == ".") {
					source = cwd + "/" + source;
				}
				cwd  = path.dirname(source);
			}
			
			load(source, outcome.error(next).success(function(task) {
				self.caller.cwd = cwd;

				self.caller.runChild(task, self.child({
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