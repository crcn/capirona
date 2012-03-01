handlebars = require "handlebars"
traverse   = require "traverse"

module.exports = (buffer, ops) ->
	
	if typeof buffer == 'object'

		traverse(buffer).forEach (v) ->
			this.update(module.exports(v, ops)) if typeof v == 'string'

		return buffer
	
		
	return handlebars.compile(buffer)(ops)

