var BaseEvaluator = require("../base/evaluator");

module.exports = BaseEvaluator.extend({

	/**
	 */

	"run": function(expression, target, next) {
		target.next = next;
		expression.value.call(target, target, next);
	},

	/**
	 */

	"test": function(expression) {
		return typeof expression.value == "function";
	}
});