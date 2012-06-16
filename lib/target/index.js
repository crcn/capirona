var structr = require("structr"),
_ = require("underscore"),
traverse = require("traverse"),
tpl = require("../tpl"),
dref = require("dref");


var magicMethods = {};

var Target = module.exports = structr({

	/** 
	 */

	"__construct": function(target, parent) {

		this._data = {};
		this._rendered = {};

		this._parent = parent;

		if(typeof target != "object") {
			this._data.value = target;
			this._data.data = {};
		} else {
			this._data.data = target;
		}
	},

	/**
	 */

	"child": function(target, render) {

		var child = new Target(target, this);
		child.defaults(this.get(render !== false));
		return child;
	},

	/**
	 */

	"defaults": function(target) {

		if(target instanceof Target) {
			if(!this._data.value) this._data.value = target._data.value;
			_.defaults(this._data.data, target._data.data);
		} else {
			if(typeof target == "object") {
				_.defaults(this._data.data, target);
			} else {
				this._data.value = target;
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

	"set": function(key, value) {

		if(arguments.length == 1) {
			if(key instanceof Target) {
				this._data = key._data;
			} else {
				this._data.data = key;
			}
		} else {
			if(this._parent) this._parent.set(key, value);
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
		var target     = new Target();
		target._data   = traverse(this._data).clone();
		target._parent = this._parent;
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
		return this._data;
	}
});


module.exports.addMagicMethod = function(MagicMethod) {

}