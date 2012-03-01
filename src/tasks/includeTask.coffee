BaseTask    = require("./base").Task
fs          = require "fs"

###
 builds from a .js file
###

module.exports = class IncludeTask extends BaseTask
	
	###
	###

	load: (ops) ->

		cfg = JSON.parse fs.readFileSync(ops.include, "utf8")

		# load the target script
		@tasks.load cfg, [@route]

	###
	 passes the build phase @
	###

	_run: (target, next) -> 
		throw new Error "Cannot call target builder"



module.exports.test = (config) ->
	return !!config.include