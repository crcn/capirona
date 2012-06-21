var JSONTree = require("./jsonTree");


module.exports = JSONTree.extend({

	/**
	 */

	"runChild": function(child, target, next) {
		return this.parser.run(this.linkChild(this.constructor.parse(child)), target, next);
	},
});