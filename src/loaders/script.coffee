fs = require 'fs'
step = require 'stepc'
outcome = require 'outcome'
path  = require "path"

exports.run = (file, next, config) -> 
	
	# relative to cwd?
	if file.substr(0, 1) == "."
		file = process.cwd() + "/" + file;

	config._cwd = path.dirname file
	require(file).load(config, next)

exports.test = (target) ->
	return /.js$/.test String(target)