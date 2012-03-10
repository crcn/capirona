fs = require 'fs'
step = require 'stepc'
outcome = require 'outcome'
path  = require "path"
vm    = require "vm"

exports.run = (file, target, next) -> 
	
	# relative to cwd?
	if file.substr(0, 1) == "."
		file = process.cwd() + "/" + file;

	script = require file

	if script.load
		script.load target, next
	else
		next null, script


exports.test = (target) ->
	return /.js$/.test String(target)