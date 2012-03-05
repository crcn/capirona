fs             = require "fs"
path           = require "path"
step           = require "stepc"
outcome        = require "outcome"
seq            = require "seq"
Tasks          = require "./collection"
traverse       = require "traverse"
Loader         = require "./loader"
TaskFactory    = require "./factory"
_              = require "underscore"
crc32          = require "crc32"
plugin         = require "plugin"
structr		   = require "structr"



### 
 the mesh config value object
###

class Config


	###
	###

	constructor: () ->

		# the tasks to run
		@_taskFactory = new TaskFactory()
		@_loadPlugins @_taskFactory, __dirname + "/tasks"
			
		# configuration delegate 
		@_configLoader = new Loader @
		@_loadPlugins @_configLoader, __dirname + "/loaders"

		# flow-control
		@_seq = seq()

		# clears vars & configs
		@clear()


	###
	 Loads  configuration
	###

	load: (target, next) ->

		self = @

		@_seq.seq () ->
			self._configLoader.load target, @

		.seq (config) ->
			self._onLoad config
			@()

		if next
			@next () -> 
				next.apply @, arguments
				@()

		@

	###
	###

	next: (fn) ->
		@_seq.seq fn
		@


	###
	 resets the tasks & vars
	###

	clear: () ->

		@config   = { buildId: crc32 String Date.now() }
		@_tasks   = new Tasks @_taskFactory, @

		@


	###
	###

	cwd: (dir) ->
		self = @
		@_seq.seq () ->
			self.cwd = dir
			this()
		@

	###
	 loads a config from disc - important because they MAY contain
	 scripts - in which case we'll need the CWD
	###

	run: (paths, target, complete) ->

		if typeof target == "function"
			complete = target
			vars     = {}

		paths = [paths] if not (paths instanceof Array)

		self = @




		@_seq.seq () ->

			if target.cwd
				self.cwd = target.cwd

			next = @

			seq(paths).
			seqEach (path) ->

				config = structr.copy(self.config)
				config = structr.copy(target, config) 
				config.task = path

				self._run path, config, (err) =>
					return complete err if err
					@()
			.seq () ->
				next()

		.
		seq () ->
			complete()


	### 
	###

	_run: (path, target, next) -> @_tasks.run path, target, next



	###
	###

	_onLoad: (config) ->
		
		
		self = @

		# fix relative paths
		traverse(config).forEach (v) ->
			if typeof v == 'string' && /^(\.|~)+(\/\w*)+/.test v
				this.update path.normalize v.replace(/^\./, self.cwd + "/.").replace(/^~/, process.env.HOME + "/");


		structr.copy config, @config
		structr.copy config.mesh, @config if config.mesh

		delete @config.mesh
		delete @config.tasks
		
		if config.mesh	
			@_tasks.load config.mesh.tasks or {}
		else if config.tasks
			@_tasks.load config.tasks


	

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



exports.make = -> new Config()







			
		