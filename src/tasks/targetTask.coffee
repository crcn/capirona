BaseTask    = require("./base").Task
structr     = require "structr"
tpl         = require "../tpl"

###
 the ENTRY point into the build system
###

module.exports = class TargetTask extends BaseTask
	
	###
	###

	load: (@target) ->
		@task = @childTask null, @target.task or @target.tasks or @target.commands

	###
	 passes the build phase 
	###

	_run: (target, next) -> 
		
		obj = {}


		#structr.copy @target, target
		structr.copy target, obj
		structr.copy @target, obj


		# parse the object incase vars are passed 
		obj = tpl.render obj, target

		@task.run obj, next

	###
	###

	_taskMessage: (target) -> 
		return "target #{target.currentPath}" if target.currentPath

	###
	###

	_pointer: () -> "* "
		




module.exports.test = (config) ->
	return !!config.task or !!config.tasks or !!config.commands