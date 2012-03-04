ejs      = require 'ejs'
structr  = require 'structr'
traverse = require 'traverse'


render = (value, data) ->

	clone = traverse(value).clone()

	return traverse(clone).forEach (x) ->

		this.update(ejs.render(x, data)) if typeof x is 'string'


exports.render = render;


