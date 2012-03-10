fs            = require "fs"
path          = require "path"
step          = require "stepc"
outcome       = require "outcome"
Routes        = require "./routes"



###
 creates new builders based on configs given
###

module.exports = class Factory
	
	###
	###

	constructor: () ->
		@_classes = []
		@routes = new Routes @
		
	###
	 adds a builder class - must also be a tester
	###

	add: (clazz) ->

		clazz.priority = 0 if not clazz.priority

		@_classes.push clazz

		@_classes = @_classes.sort (a, b) ->
			if a.priority > b.priority
				return -1
			else
				return 1

	###
	 returns a new builder based on the options given. CWD is also
	 important since SOME builders may load from disc
	###

	newTask: (name, ops, parent) ->


		for clazz in @_classes

			if clazz.test ops
				
				# new builder 
				task = new clazz name, @, parent

				# load it with the options given
				task.load ops

				# return the builder
				return task

		# no builder? return null
		null