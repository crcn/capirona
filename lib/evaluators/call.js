var BaseEvaluator = require("../base/evaluator"),
_                 = require("underscore"),
structr           = require("structr"),
tpl               = require("../tpl"),
Context           = require("../context"),
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

	"run": function(expression, context, next) {

		var runArgs, command, childContext, runArgsCtx;


		//this will happen when a command is something like run({ "command": {...}})
		if(expression.name) {
			command = expression.name;
			runArgs = traverse(expression.value).clone();

		//this will happen if the command is the only thing - run("command")
		} else {
			command = expression.value;

			//set run args to no data
			runArgs = {};
		}

		//the command may have arg values ~ "some/command/<%-contextValue %>"
		command = tpl.render(command, context.get());

		//call for a relative command that might be embedded in a script
		command = this._relativeCommand(expression, command);


		runArgsCtx = context.child(runArgs);

		//the actual context data passed in the second param 
		runArgsCtx.context = context;

		//callback so more commands can be run
		runArgsCtx.caller = expression;

		this.evaluator.commands.run(command, runArgsCtx, outcome.error(next).success(function() {
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