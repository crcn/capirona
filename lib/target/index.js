var structr = require("structr"),
_ = require("underscore"),
traverse = require("traverse");


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

		if(target instanceof Target) {
			this.parent = target;
			if(!this.value) this.value = target.value;
			_.defaults(this.data, target.data);
		} else {
			if(typeof target == "object") {
				_.defaults(this.data, target);
			} else {
				this.value = target;
			}
		}

		return this;
	},

	/**
	 */

	"clone": function() {
		var target = new Target(traverse(this.data).clone());
		target.value = this.value;
		return target;
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