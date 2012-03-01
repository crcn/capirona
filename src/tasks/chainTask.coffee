seq			= require "seq"
BaseTask    = require("./base").Task
outcome     = require "outcome"


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

		self = @


		seq(@chains).
		seqEach( (chain, next) ->
			chain.run target, outcome.error(this).success(this)
		).seq ->
			next()
	


module.exports.test = (config) ->
	return config instanceof Array
