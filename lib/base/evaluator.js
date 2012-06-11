var structr = require("structr");


module.exports = structr({

	/**
	 */

	"priority": 1,

	/**
	 */

	"__construct": function(evaluator) {
		this.evaluator = evaluator;
		this.init();
	},

	/**
	 */

	"init": function() { },

	/**
	 */

	"test": function(target) { }
})