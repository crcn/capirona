var Tree = require("./tree");



var JSONTree = module.exports = Tree.extend({

	/**
	 */

	"override __construct": function(name, value) {
		this._super();
		this.name  = name;
		this.value = value;
	},

	/**
	 */

	"override toJSON": function() {
		var data = this._super();
		data.name = this.name;
		if(typeof this.value != "object") data.value = this.value;
		return data;
	},

	/**
	 */

	"find": function(name) {
		return this._deepFind(name.split(":"));
	},

	/**
	 */

	"_deepFind": function(nameParts) {

		var currentName = nameParts.shift();

		if(!currentName) return this;

		for(var i = this._children.length; i--;) {
			var child = this._children[i];
			if(child.name == currentName) {
				return child._deepFind(nameParts);
			}
		}

		return null;
	},

	/** 
	 * parses a raw config file
	 */

	"static parse": function(value, name) {

		var doc = new this(name, value);

		if(value instanceof Array) {
			for(var i = 0, n = value.length; i < n; i++) {
				var rawChild = value[i];
				doc.addChild(this.parse(rawChild));
			}
		} else 
		if(typeof value == "object") {
			for(var name in value) {
				doc.addChild(this.parse(value[name], name));
			}
		}

		return doc;
	}
});


