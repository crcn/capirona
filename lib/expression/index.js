var JSONTree = require("./jsonTree");


module.exports = JSONTree.extend({

	/**
	 */

	"runChild": function(child, target, next) {
		return this.parser.run(this.addChild(this.constructor.parse(child)), target, next);
	},
});