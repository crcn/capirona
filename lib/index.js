var structr = require("structr");
structr.mixin(require("structr-step"));
Expression = require("./expression"),
Evaluator = require("./evaluator"),
Target    = require("./target");


var Capirona = structr({

	/**
	 */

	"__construct": function() {
		this._evaluator = new Evaluator(this);
	},

	/**
	 */

	"step make": function(source, next) {
		var self = this;
		self._evaluator.run(Expression.parse(source), new Target({}, this), next);
	},

	/**
	 */

	"step run": function(command, target, next) {
		this._evaluator.commands.run(command, new Target(target, this), next);
	}
});


exports.make = function() {
	return new Capirona().make(Array.prototype.slice.call(arguments, 0));
}