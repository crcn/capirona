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
		@cwd = @tasks.makeConfig.cwd

	###
	 passes the build phase @
	###

	_run: (target, next) -> 
		@tasks.makeConfig.load @_cfgPath(target), next

	###
	###

	_taskMessage: (target) -> "loading ./#{path.relative @cwd, @_cfgPath target}"


	###
	###

	_cfgPath: (target) -> tpl.render @cfg, target



module.exports.test = (config) ->
	return !!config.load