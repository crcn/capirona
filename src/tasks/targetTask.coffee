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
		delete @target.tasks
		delete @target.commands

	###
	 passes the build phase 
	###

	_run: (target, next) -> 
		
		obj = {}

		# oh god what a mess >.>
		# TODO: clean me.

		# first need to copy the old config
		oldConfig = structr.copy target

		# copy the NEW config to the old config - prepare for parsing incase
		# the new config has some vars we need to render
		oldConfig = structr.copy @target, oldConfig

		# render the NEW config from the OLD config + new config - at this point
		# we ONLY want what's new so we can return it
		renderedConfig = tpl.render(@target, oldConfig)

		# finally - copy the CHANGED vars over to the OLD config
		target = structr.copy(renderedConfig, target)




		#structr.copy target, obj
		#structr.copy @target, obj


		# parse the object incase vars are passed 
		#obj = tpl.render obj, target
		obj = target

		@task.run obj, next

	###
	###

	#_taskMessage: (target) -> 
	#	return "make with #{target.currentPath}" if target.currentPath

	_printMessage: () ->
		




module.exports.test = (config) ->
	return !!config.task or !!config.tasks or !!config.commands