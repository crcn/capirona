var structr = require("structr");
structr.mixin(require("structr-step"));
Expression = require("./expression"),
Evaluator = require("./evaluator"),
Target    = require("./target"),
defaultTasks  = require("./tasks");


var Parser = structr({

	/**
	 */

	"__construct": function() {
		this._evaluator = new Evaluator(this);
	},

	/**
	 */

	"make": function(source, target, next) {
		this._evaluator.run(Expression.parse(source), Target.parse(target), next);
	},

	/**
	 */

	"run": function(command, target, next) {
		this._evaluator.commands.run(command, Target.parse(target), next);
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

	"step make": function(source, target, next) {
		this._parser.make(source, target, next);
	},

	/**
	 */

	"step run": function(command, target, next) {
		this._parser.run(command, target, next);
	},


	/**
	 */

	"_loadDefaults": function() {
		for(var i = defaultTasks.length; i--;) {
			this.make(defaultTasks[i]);
		}
	}
});


exports.make = function() {
	return new Capirona().make(Array.prototype.slice.call(arguments, 0));
}