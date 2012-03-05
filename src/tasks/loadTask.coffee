BaseTask    = require("./base").Task
fs          = require "fs"
structr		= require "structr"
path        = require "path"
tpl         = require "../tpl"

###
 builds from a .js file
###

module.exports = class LoadTask extends BaseTask
	
	###
	###

	load: (ops) ->
		@cfg = ops.load
		@cwd = ops.cwd
		@cfgDir = @tasks.makeConfig.pathDir

	###
	 passes the build phase @
	###

	_run: (target, next) -> 

		makeConfig = @tasks.makeConfig


		makeConfig.load @_cfgPath(target), { cwd: tpl.render @cwd, target }, (err, result) ->
			return next(err) if err
			newTarget = structr.copy result.config, target
			next()

	###
	###

	_taskMessage: (target) -> "loading ./#{path.relative @cfgDir, @_cfgPath target}"


	###
	###

	_cfgPath: (target) -> tpl.render @cfg, target



module.exports.test = (config) ->
	return !!config.load