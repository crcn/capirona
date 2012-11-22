var structr = require("structr"),
_ = require("underscore"),
traverse = require("traverse"),
tpl = require("../tpl"),
dref = require("dref");


var magicMethods = {};

var Context = module.exports = structr({

	/** 
	 */

	"__construct": function(context, parent) {

		this._data     = {};
		this._rendered = {};
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
		child.defaults(this.get(render !== false));
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

	"get": function(key, render) {

		if(typeof key === "boolean" || !arguments.length) {
			return this._get("data", key);
		}

		return this._get("data." + key, render);
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
			if(this._parent && bubble !== false) this._parent.set(key, value);
			dref.set(this._data, "data." + key, value);
		}


		//clear cache
		this._rendered = {};
	},

	/**
	 */

	"value": function(render) {
		return this._get("value", render);
	},

	/**
	 */

	"_get": function(key, render) {

		var cv = dref.get(this._data, key),
		v = cv;

		if(!v) {
			// if(this._parent) return this._parent._get(key, render);
			return v;
		}

		if(this._rendered[key]) {
			return this._rendered[key];
		}

		if(render !== false) {
			this._rendered[key] = v = tpl.render(cv, this._data.data);
		}

		return v;
	},

	/**
	 */

	"clone": function() {
		var context    = new Context();
		context._data   = traverse(this._data).clone();
		context._parent = this._parent;
		return context;
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