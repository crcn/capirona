outcome  = require "outcome"
_        = require "underscore"
beanpoll = require "beanpoll"
structr  = require "structr"


###
###

class TaskMessenger extends beanpoll.Messenger

	###
	###

	_next: (middleware) ->

		middleware.listener.call @, @data(), @response.success () => @next()
			

###
###

class TaskDirector extends beanpoll.Director

	###
	###

	passive: false

	###
	###

	_newMessenger: (request, middleware) -> new TaskMessenger request, middleware, @

###
 collection of builders loaded from configurations
###

module.exports = class Tasks

	###
	###

	constructor: (@factory, @makeConfig) ->
		@_tasks = {}
		@factory.tasks = @
		@_router = beanpoll.router()

		@_router.use () =>
			name: 'task',
			director: new TaskDirector 'task', @_router

	###
	###

	load: (rawTasks, inherit) ->

		inherit = [] if not inherit


		for routeStr of rawTasks
			for route in @_parseTaskName routeStr, inherit

				taskData = rawTasks[routeStr]

				task = @factory.newTask route, taskData

				if task
					@add task
				else
					@load taskData, inherit.concat route
									
		@
			

	###
	###

	_parseTaskName: (routeStr, inherit) ->

		# make the route compatable with beanpoll 
		fixed  = @_fixPath routeStr
		routes = @_router.parse(fixed)


		for route in routes

			route = @_extendRoute route, inherit

		return routes

	###
	###

	_extendRoute: (target, parents) ->


		for parent in parents.reverse()
			parentCopy = structr.copy(parent)

			# pre = parentCopy.path.segments[parentCopy.path.segments.length - 1].value is '*'

			# extending child routes? concat the pre-path the the children
			#if pre
			# parentCopy.path.segments.pop()
			target.path = @_router.parse.parsePath @_router.parse.stringifySegments parentCopy.path.segments.concat target.path.segments
				


			thru = target

			while thru.thru
				thru = thru.thru

			thru.thru = parentCopy.thru

		target

			

	###
	###

	_fixPath: (path) ->
		path.
		replace(/:/g,'/').
		replace(/\{\{(\w+)\}\}/g, ':$1')

	###
	###

	add: (task) -> 

		task.route.type = "task"
		@_router.on task.route, (target, next) =>
			task.run target, next
	###
	###

	run: (path, target, next) ->

		_.defaults target, @makeConfig.vars

		@_router.
		request(@_fixPath path).
		query(target).
		next (target, next) ->
			this.response.end()
		.
		error(next).
		success(next).
		dispatch('task');


			
