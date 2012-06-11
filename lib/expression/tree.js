var structr = require("structr"),
seq = require("seq")

module.exports = structr({


	/**
	 */

	"__construct": function() {
		this._children = [];
		this._numChildren = 0;
	},


	/**
	 */

	"root": function() {
		var parent = this;
		while(parent._parent) {
			parent = parent._parent;
		}
		return parent;
	},

	/**
	 */

	"parent": function() {
		return this._parent;
	},

	/**
	 */

	"children": function() {
		return this._children;
	},

	/**
	 */

	"numChildren": function() {
		return this._numChildren;
	},

	/**
	 */

	"addChild": function(child) {
		return this.addChildAt(child, this._children.length);
	},

	/**
	 */

	"depth": function() {
		var depth = 0, parent = this;
		while(parent) {
			depth++;
			parent = parent._parent;
		}
		return depth;
	},

	/**
	 */

	"traverse": function(callback, next) {
		var self = this;

		callback(this, function(err, continueTraverse) {

			if(err || (continueTraverse === false)) {
				return next(err);
			}

			seq(self._children).seqEach(function(child) {
				var next = this;
				child.traverse(callback, next);
			}).seq(function() {
				if(next) next();
			});
		});
	},

	/**
	 */

	"addChildAt": function(child, index) {
		if(child._parent) {
			child._parent.removeChild(child);
		}
		this._numChildren++;
		this._children.splice(index, 0, child);
		return this._linkChild(child);
	},

	/**
	 */

	"removeChild": function(child) {
		return this.removeChildAt(this._children.indexOf(child));
	},

	/**
	 */

	"removeChildAt": function(index) {
		if(!~index) return null;
		var child = this._children[index];
		this._children.splice(index, 1);
		this._numChildren--;
		return this._delinkChild(child);
	},

	/**
	 */

	"getChildIndex": function(child) {
		return this._children.indexOf(child);
	},

	/**
	 */

	"getChildAt": function(index) {
		if(index < 0 || index > this._children.length) return null;
		return this._children[index];
	},

	/**
	 */

	"getNextSibling": function() {
		var index = this._parent._children.indexOf(this);
		return this._parent.getChildAt(index + 1);
	},

	/**
	 */

	"getPrevSibling": function() {
		var index = this._parent._children.indexOf(this);
		return this._parent.getChildAt(index - 1);
	},

	/**
	 */

	"getLastSibling": function() {
		return this._parent.getChildAt(this._parent._children.length - 1);
	},

	/**
	 */

	"getFirstSibling": function() {
		return this._parent.getChildAt(0);
	},


	/**
	 */

	"toJSON": function() {

		var children = [];

		for(var i = 0, n = this._children.length; i < n; i++) {
			children.push(this._children[i].toJSON());
		}

		return {
			children: children
		};
	},

	/**
	 */

	"_linkChild": function(child) {
		child._parent = this;
	},

	/**
	 */

	"_delinkChild": function(child) {
		child._parent = null;
	}
});