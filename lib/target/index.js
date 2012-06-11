var structr = require("structr"),
_ = require("underscore");


module.exports = structr({

	/** 
	 */

	"__construct": function(target, parser) {

		this.parser = parser;

		if(typeof target != "object") {
			this.value = target;
			this.data  = {};
		} else {
			this.data = target;
		}
	},

	/**
	 */

	"defaults": function(target) {
		if(!this.value) this.value = target.value;
		this.data = _.defaults(this.data, target);
		return this;
	}
})