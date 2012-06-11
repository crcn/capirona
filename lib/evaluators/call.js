var BaseEvaluator = require("../base/evaluator"),
_                 = require("underscore"),
structr           = require("structr"),
tpl               = require("../tpl"),
Target            = require("../target");

module.exports = BaseEvaluator.extend({

	/**
	 * because we're only looking for a string...
	 */

	"priority": -999,

	/**
	 */

	"run": function(expression, target, next) {


		var callTarget, command;

		if(expression.name) {
			command = expression.name;
			callTarget = Target.parse(expression.value);
		} else {
			command = expression.value;
			callTarget = new Target();
		}

		callTarget.caller = expression;
		tpl.render(callTarget.data, target.data);
		callTarget.value = tpl.render(callTarget.value, target.data);
		callTarget.defaults(target);

		this.evaluator.commands.run(command, callTarget, next);
	},

	/**
	 */

	"test": function(target) {
		return !!target.name || (typeof target.value == "string");
	}
})