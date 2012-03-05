BaseTask    = require("./base").Task
tpl         = require "../tpl"
path        = require "path"


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
		route = tpl.render @taskName, target

		if @parent and route.substr(0, 1) == '.'
			route = path.normalize(@parent.route.path.value + "/" + route)

		route





module.exports.test = (config) ->
	return typeof config == "string"