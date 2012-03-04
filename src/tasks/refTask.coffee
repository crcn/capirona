BaseTask    = require("./base").Task
tpl         = require "../tpl"


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
		tpl.render @taskName, target




module.exports.test = (config) ->
	return typeof config == "string"