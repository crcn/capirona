var BaseEvaluator = require("../base/evaluator"),
_                 = require("underscore"),
structr           = require("structr"),
tpl               = require("../tpl"),
Target            = require("../target"),
path              = require("path"),
outcome           = require("outcome"),
traverse          = require("traverse");

module.exports = BaseEvaluator.extend({

	/**
	 * because we're only looking for a string...
	 */

	"priority": -999,

	/**
	 */

	"run": function(expression, target, next) {
		
		var callTargetValue, command;

		if(expression.name) {
			command = expression.name;
			callTargetValue = traverse(expression.value).clone();//typeof expression.value == "object" ? structr.copy(expression.value) : expression.value;
			
		} else {
			command = expression.value;
		}

		command = tpl.render(command, target.get());


		var childTarget = target.child(callTargetValue);
		childTarget.caller = expression;
		this.evaluator.commands.run(this._relativeCommand(expression, command), childTarget, outcome.error(next).success(function() {
			
			next(null, false);
		}));
	},

	/**
	 */

	"_relativeCommand": function(expr, command) {

		if(command.substr(0, 1) != ".") return command;

		var cp = expr.parent();


		while(cp) {
			if(cp.routes) break;
			cp = cp.parent();
		}

		if(cp && cp.routes) {
			return path.normalize(cp.routes[0].path.value + "/" + command);
		}

		return command;
	},

	/**
	 */

	"test": function(expression) {
		return !!expression.name || (typeof expression.value == "string");
	}
})