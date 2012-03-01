seq			= require "seq"
BaseTask    = require("./base").Task
outcome     = require "outcome"
structr     = require "structr"


###
 a chain of builders

 Example:

 "firefox":["combine","compile-firefox"]
###

module.exports = class ChainedTask extends BaseTask
	
	###
	###

	load: (chains) ->
		
		@chains = []
		for rawTask in chains
			@chains.push @tasks.factory.newTask(null, rawTask)
		
				
	###
	###

	_run: (target, next) ->

		# target = structr.copy(target)

		self = @

		seq(@chains).
		seqEach( (chain) ->
			chain.run target, outcome.error(next).success () =>
				this()
		).seq ->
			next()
	


module.exports.test = (config) ->
	return config instanceof Array
