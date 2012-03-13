BaseTask    = require("./base").Task
tpl         = require "../tpl"
path        = require "path"


###
 references another builder
###

module.exports = class RegisterRoutesTask extends BaseTask
	
	###
	###

	load: (@ops) -> @factory.commands.load @ops, @_findInheritable(), @


	###
	 passes the build phase 
	###

	_run: (target, next) -> next()

	###
	###

	_printMessage: () ->


	###
	###

	_findInheritable: () ->
		cr = @

		while cr.parent
			cr = cr.parent
			break if cr.route

		return cr.route

	





module.exports.test = (config) ->
	return typeof config == "object"

module.exports.priority = -999;