BaseTask    = require("./base").Task
tpl         = require "../tpl"
path        = require "path"


###
 references another builder
###

module.exports = class RegisterRoutesTask extends BaseTask
	
	###
	###

	load: (@ops) ->


	###
	 passes the build phase 
	###

	_run: (target, next) -> 
		@factory.commands.load @ops
		next()

	###
	###
	_printMessage: () ->
	





module.exports.test = (config) ->
	return typeof config == "object"

module.exports.priority = -999;