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
			callTarget = new Target(expression.value);
		} else {
			command = expression.value;
			callTarget = new Target();
		}



		tpl.render(callTarget.data, target.data);
		callTarget.value = tpl.render(callTarget.value, target.data);

		this.evaluator.commands.run(command, callTarget.defaults(target), next);
	},

	/**
	 */

	"test": function(target) {
		return !!target.name || (typeof target.value == "string");
	}
})