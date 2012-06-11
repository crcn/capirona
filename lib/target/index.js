var structr = require("structr"),
_ = require("underscore");


var Target = module.exports = structr({

	/** 
	 */

	"__construct": function(target) {
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
		this.parent = target;
		if(!this.value) this.value = target.value;
		_.defaults(this.data, target.data);
		return this;
	},


	/**
	 */

	"static parse": function(value) {
		return value instanceof Target ? value : new Target(value);
	},

	/**
	 */

	"toJSON": function() {
		return {
			value: this.value,
			data: this.data
		}
	}
})