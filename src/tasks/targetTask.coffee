BaseTask    = require("./base").Task
structr     = require "structr"
tpl         = require "../tpl"
watch_r     = require "watch_r"

###
 the ENTRY point into the build system
###

module.exports = class TargetTask extends BaseTask
		
	
	###
	###

	load: (@target) ->
		@task = @childTask null, target.task or target.tasks or target.commands
		@watch = target.watch
		@timeout = target.timeout
		delete target.tasks
		delete target.commands

	###
	 passes the build phase 
	###

	_run: (target, next) -> 
		
		obj = {}


		# oh god what a mess >.>
		# TODO: clean me.

		this.watchPath = tpl.render(this.watch, target) if this.watch;

		# first need to copy the old config
		oldConfig = structr.copy target

		newConfig = @target

		# copy the NEW config to the old config - prepare for parsing incase
		# the new config has some vars we need to render
		oldConfig = structr.copy newConfig, oldConfig


		# render the NEW config from the OLD config + new config - at this point
		# we ONLY want what's new so we can return it
		renderedConfig = tpl.render(newConfig, oldConfig)


		# finally - copy the CHANGED vars over to the OLD config
		target = structr.copy(renderedConfig, target)


		@currentData = target

		obj = target


		@_run2 obj, next

	###
	###

	_watch: (target) ->

		watch_r @watchPath, (err, watcher) =>

			watcher.on "change", (target) =>
				watcher.dispose()
				@_run2 target



	###
	###

	_run2: (target, next) ->

		@task.run target, () =>
			next.apply this, arguments if next
			@_watch target if @watch


	###
	###

	_printMessage: () ->






module.exports.test = (config) ->
	return !!config.task or !!config.tasks or !!config.commands