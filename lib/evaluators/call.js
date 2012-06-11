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


		var parsed = tpl.render(callTarget.properties, target.properties);

		this.evaluator.commands.run(command, callTarget.defaults(target), next);
	},

	/**
	 */

	"test": function(target) {
		return !!target.name || (typeof target.value == "string");
	}
})