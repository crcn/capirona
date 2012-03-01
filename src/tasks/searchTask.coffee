BaseTask    = require("./base").Task
handlebars  = require "handlebars"
walkr       = require "walkr"
structr     = require "structr"
outcome     = require "outcome"

###
 the ENTRY point into the build system
###

module.exports = class SearchTask extends BaseTask
	
	###
	###

	load: (options) ->
	
		@dir = options.directory

		tasks = @findTasks = []

		for search of options.find
			tasks.push({
				search: new RegExp(search),
				task: @tasks.factory.newTask(search, options.find[search])
			})

	###
	 passes the build phase 
	###

	_run: (target, next) -> 
		
		walkr(@dir).
		filter (options, next) =>
			
			for filt in @findTasks
				if filt.search.test(options.source)
					return filt.task.run structr.copy(target, { file: options.source }), next.success () ->
							next()

			next()

		.start next
			
	###
	###

	_printMessage: ->
		




module.exports.test = (config) ->
	return !!config.directory && !!config.find