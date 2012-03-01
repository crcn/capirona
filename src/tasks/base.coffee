###
 base builder interface
###

exports.Task = class

	###
	###

	constructor: (@route, @tasks = null) ->
	
	###
	 load from raw config
	###

	load: (ops) -> # override me

	###
	 start the build phase
	###

	run: (target, next) ->
			
		# only set the name if it exists - could be a reference, or chain. In
		# which case we want the PARENT chain
		if @route
			target.namespace   = @route.path.value
			target.currentTask = @route.path.value.split('/').pop()

		@_printMessage target

		@_run target, next

	###
	###

	_run: (target, next) ->

	###
	###

	_printMessage: (target) ->
		console.log "#{@_pointer()}#{@_taskMessage target}"
		

	###
	###

	_taskMessage: (target) -> 
		if @route
			"make #{@route.path.value}"


	###
	###

	_pointer: () -> "---> "

module.exports.test = () -> false

