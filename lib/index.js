var structr = require("structr");
structr.mixin(require("structr-step"));
Expression = require("./expression"),
Evaluator = require("./evaluator"),
Target    = require("./target"),
defaultTasks  = require("./tasks"),
Logger = require("./logger");


var Parser = structr({

	/**
	 */

	"__construct": function() {
		this.logger = new Logger();
		this._evaluator = new Evaluator(this);
	},

	/**
	 */

	"run": function(source, target, next) {
		this._evaluator.run(Expression.parse(source), Target.parse(target), next);
	}
})


var Capirona = structr({

	/**
	 */

	"__construct": function() {
		this._parser = new Parser();
		this._loadDefaults();
	},

	/**
	 */

	"step run": function(source, target, next) {
		this._parser.run(source, target, next);
	},


	/**
	 */

	"_loadDefaults": function() {
		for(var i = defaultTasks.length; i--;) {
			this.run(defaultTasks[i]);
		}
	}
});


exports.run = function(source, target, next) {
	return new Capirona().run(source, target, next);
}