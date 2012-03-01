seq			= require "seq"
BaseTask    = require("./base").Task
outcome     = require "outcome"
parseTpl    = require "../parseTpl"


###
 a chain of builders

 Example:

 "firefox":["combine","compile-firefox"]
###

module.exports = class LogTask extends BaseTask
	
	###
	###

	load: (obj) -> 
		@log = obj.log
		
		
				
	###
	###

	_run: (target, next) ->
		console.log parseTpl(@log, target)
		next()
	


module.exports.test = (config) ->
	return !!config.log
