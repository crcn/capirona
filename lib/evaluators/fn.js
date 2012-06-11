var BaseEvaluator = require("../base/evaluator");

module.exports = BaseEvaluator.extend({

	/**
	 */

	"run": function(expression, target, next) {
		target.next = next;
		target.expresson = expression;
		expression.value(target, next);
	},

	/**
	 */

	"test": function(expression) {
		return typeof expression.value == "function";
	}
});