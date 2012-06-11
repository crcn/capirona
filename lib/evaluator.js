var structr = require("structr"),
plugin      = require("plugin"),
Commands    = require("./commands");

/**
 * Abstract factory
 */

module.exports = structr({


	/**
	 */

	"__construct": function(parser) {
		this.parser = parser;
		this.commands = new Commands(this);
		this._evaluators = [];
		this._load();
	},

	/**
	 */

	"add": function(EvaluatorClass) {
		var evaluator = new EvaluatorClass(this);
		this._evaluators.push(evaluator);
		this._sortEvaluators();
	},

	/**
	 */

	"run": function(expression, target, onEval) {

		var self = this;
		expression.traverse(function(child, next) {
			self._runChild(child, target, next);
		}, onEval);
	},

	/**
	 */

	"_runChild": function(expression, target, onEval) {
		for(var i = this._evaluators.length; i--;) {
			var evaluator = this._evaluators[i];
			if(evaluator.test(expression)) {
				return evaluator.run(expression, target, onEval);
			}
		}
		onEval();
	},

	/**
	 */

	"_sortEvaluators": function() {
		this._evaluators = this._evaluators.sort(function(a, b) {
			return a.priority < b.priority ? -1 : 1;
		})
	},

	/**
	 */

	"_load": function() {
		var self = this;
		plugin.
		loader().
		factory(function(plugin) {
			self.add(plugin);
		}).
		require(__dirname + "/evaluators").
		load();
	}
})