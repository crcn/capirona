

module.exports = class Loader

	###
	###

	constructor: () ->
		@_loaders = []

	###
	###

	load: (target, next) ->

		for loader in @_loaders
			return loader.run(target, next) if loader.test target

		throw new Error "Cannot load #{target}"

	###
	###

	add: (loader) -> @_loaders.push loader