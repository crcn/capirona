fs             = require "fs"
path           = require "path"
step           = require "stepc"
Routes          = require "./routes"
traverse       = require "traverse"
Loader         = require "./loader"
TaskFactory    = require "./factory"
_              = require "underscore"
crc32          = require "crc32"
plugin         = require "plugin"
structr		   = require "structr"
tpl            = require "./tpl"



### 
 the mesh config value object
###

class RootTask


	###
	###

	constructor: (rawTasks) ->

		# makes new tasks based on config data
		@taskFactory = new TaskFactory @
		@_loadPlugins @taskFactory, __dirname + "/tasks"

		# the entry task 
		@entryTask = @taskFactory.newTask null, rawTasks


	###
	 loads a config from disc - important because they MAY contain
	 scripts - in which case we'll need the CWD
	###

	run: (target, complete) ->

		if typeof target == 'function'
			complete = target
			target = {}

		target.buildId = crc32 String Date.now()

		@entryTask.run target, complete


	###
	 loads plugins for task factory, or config loader
	###

	_loadPlugins: (factory, directories) ->

		plugin.
		loader().
		factory (plugin) ->
			factory.add plugin
		.
		require(directories).
		load()



exports.make = () -> new RootTask Array.apply [], arguments







			
		