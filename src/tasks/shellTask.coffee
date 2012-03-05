BaseTask    = require("./base").Task
tpl         = require "../tpl"
exec        = require("child_process").exec

###
 executes a shell script
###

module.exports = class ShellTask extends BaseTask
	
	###
	###

	load: (ops) ->
		@exec = ops.exec

	###
	 passes the build phase 
	###

	_run: (target, next) -> 

		cmd = @_cmd target

		console.log(target.cwd)

		exec cmd, { cwd: target.cwd }, (err, stdout, stderr) ->
			
			console.log stdout if stdout
			console.error stderr if stderr
			next()

	###
	###

	_taskMessage: (target) -> @_cmd target

	###
	###

	_cmd: (target) -> 	
		return tpl.render @exec, target



module.exports.test = (config) ->
	return !!config.exec