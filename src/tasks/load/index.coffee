fs          = require "fs"
tpl         = require "../../tpl"
path        = require "path"
plugin      = require "plugin"
structr     = require "structr"
BaseTask    = require("../base").Task

###
 builds from a .js file
###

module.exports = class LoadTask extends BaseTask

	###
	###

	init: () ->

		@_loaders = []

		@factory.__loadedScripts = {} if not @factory.__loadedScripts;

		plugin.
		loader().
		factory (plugin) =>
			@_loaders.push plugin
		.
		require(__dirname + "/loaders").
		load()
	
	###
	###

	load: (ops) ->
		@cfg = ops.load
		@cwd = ops.cwd
		@cfgDir = path.dirname @cfg


	###
	 passes the build phase @
	###

	_run: (target, next) -> 

		target.cwd = @_findCwd()


		
		pt = fs.realpathSync @_cfgPath target

		@liveDir = path.dirname pt

		return next() if @factory.__loadedScripts[pt]

		@factory.__loadedScripts[path] = true;

		@_findLoader(pt).run pt, target, next.success (config) =>

			if @cwd
				target.cwd = tpl.render @cwd, target

			@childTask(null, config).run(target, next)


	###
	###

	_taskMessage: (target) -> "load #{@_cfgPath target}"


	###
	###

	_findCwd: () ->
		cp = @parent

		while cp
			cwd = cp.liveDir
			cp = cp.parent
			break if cwd

		cwd or process.cwd()

	###
	###

	_cfgPath: (target) -> tpl.render @cfg, target


	###
	###

	_findLoader: (ops) ->
		for loader in @_loaders
			return loader if loader.test ops



module.exports.test = (config) -> return !!config.load


module.exports.priority = 0;