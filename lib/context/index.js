var structr = require("structr"),
_ = require("underscore"),
traverse = require("traverse"),
dref = require("dref");


var magicMethods = {};

var Context = module.exports = structr({

	/** 
	 */

	"__construct": function(context, parent) {

		this._data     = {};
		this._parent   = parent;

		if(typeof context != "object") {
			this._data.value = context;
			this._data.data = {};
		} else {
			this._data.data = context;
			this.keys = Object.keys(context);
		}
	},

	/**
	 */

	"child": function(context, render) {
		var child = new Context(context, this);
		// child.defaults(this.get(render !== false));
		return child;
	},

	/**
	 */

	"defaults": function(context) {


		if(context instanceof Context) {
			if(!this._data.value) this._data.value = context._data.value;
			_.defaults(this._data.data, context._data.data);
		} else {
			if(typeof context == "object") {
				_.defaults(this._data.data, context);
			} else {
				this._data.value = context;
			}
		}

		return this;
	},

	/**
	 */

	"overwrite": function(context) {


		if(context instanceof Context) {
			_.extend(this._data.data, context._data.data);
		} else {
			if(typeof context == "object") {
				_.extend(this._data.data, context);
			} else {
				// this._data.value = target;
			}
		}

		return this;
	},

	/**
	 */

	"get": function(key) {

		if(typeof key === "boolean" || !arguments.length) {
			return this._get("data", key);
		}

		return this._get("data." + key);
	},

	/**
	 */

	"set": function(key, value, bubble) {

		if(arguments.length == 1) {
			if(key instanceof Context) {
				this._data = key._data;
			} else {
				this._data.data = key;
			}
		} else {
			if(this._parent && bubble) this._parent.set(key, value);
			dref.set(this._data, "data." + key, value);
		}
	},

	/**
	 */

	"value": function(render) {
		var v = this._get("value", render);
		if(!v && this._parent) v = this._parent.value();
		return v;
	},

	/**
	 */

	"_get": function(key) {
		return dref.get(this._data, key);
	},

	/**
	 */

	"clone": function() {
		return new Context(traverse(this._data).clone(), this._parent);
	},


	/**
	 */

	"static parse": function(value) {
		return value instanceof Context ? value : new Context(value);
	},

	/**
	 */

	"toJSON": function() {
		return this._data;
	}
});


module.exports.addMagicMethod = function(MagicMethod) {

}