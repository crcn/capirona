fs = require 'fs'
step = require 'stepc'
outcome = require 'outcome'
path  = require "path"

exports.run = (file, next) -> 
	
	# relative to cwd?
	if file.substr(0, 1) == "."
		file = process.cwd() + "/" + file;

	require(file).load(null, next)

exports.test = (target) ->
	return /.js$/.test String(target)