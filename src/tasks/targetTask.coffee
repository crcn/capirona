BaseTask    = require("./base").Task
structr     = require "structr"
parseTpl    = require "../parseTpl"

###
 the ENTRY point into the build system
###

module.exports = class TargetTask extends BaseTask
	
	###
	###

	load: (@target) ->
		@task = @tasks.factory.newTask null, @target.task

	###
	 passes the build phase 
	###

	_run: (target, next) -> 
		
		obj = {}

		#structr.copy @target, target
		structr.copy target, obj
		structr.copy @target, obj


		# parse the object incase vars are passed 
		obj = parseTpl(obj, target)

		@task.run obj, next
	
	###
	###

	_taskMessage: (target) -> "target #{if @route then @route.path.value else target.name || ""}"

	###
	###

	_pointer: () -> ""
		




module.exports.test = (config) ->
	return !!config.task