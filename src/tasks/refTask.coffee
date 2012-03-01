BaseTask    = require("./base").Task
parseTpl    = require "../parseTpl"

###
 references another builder
###

module.exports = class RefTask extends BaseTask
	
	###
	###

	load: (@taskName) ->


	###
	 passes the build phase 
	###

	_run: (target, next) -> 
		@tasks.run @_find(target), target, next

	###
	###
	_printMessage: () ->
	
	###
	###

	_find: (target) ->
		return parseTpl @taskName, target




module.exports.test = (config) ->
	return typeof config == "string"