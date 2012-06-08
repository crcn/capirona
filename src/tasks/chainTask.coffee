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

	load: (config) ->

		cfg = {}

		if config instanceof Array
			cfg.chain = config
		else
			cfg = config


		@parallel = !!cfg.parallel
		@chains = []
		for rawTask in cfg.chain
			@chains.push @childTask(null, rawTask, @)
		
	###
	###

	_printMessage:() ->
				
	###
	###

	_run: (target, next) ->

		self = @

		fn = if @parallel then 'parEach' else 'seqEach'

		seq(@chains)[fn]( (chain) ->
			chain.run target, outcome.error(next).success () =>
				this()
		).seq ->
			next()
	


module.exports.test = (config) ->
	return (config instanceof Array) or (config.chain instanceof Array)
