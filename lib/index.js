var structr = require("structr");
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

	"make": function(source) {
		var self = this;

		var expression = Expression.parse(source);

		expression.run = function(targetSource, next) {

			if(typeof target == "function" && !next) {
				next = target;
				target = {};
			}

			self._evaluator.run(expression, new Target(targetSource, self), next);
		}

		return expression;
	}
});


exports.make = function() {
	return new Capirona().make(Array.prototype.slice.call(arguments, 0));
}