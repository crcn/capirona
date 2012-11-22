var structr = require("structr");
structr.mixin(require("structr-step"));
Expression = require("./expression"),
Evaluator = require("./evaluator"),
Context    = require("./context"),
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

	"run": function(source, context, next) {
		this._evaluator.run(Expression.parse(source), Context.parse(context), next);
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

	"step run": function(source, context, next) {
		this._parser.run(source, context, next);
	},


	/**
	 */

	"_loadDefaults": function() {
		for(var i = defaultTasks.length; i--;) {
			this.run(defaultTasks[i]);
		}
	}
});


exports.run = function(source, context, next) {
	return new Capirona().run(source, context, next);
}