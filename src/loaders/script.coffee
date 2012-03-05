fs = require 'fs'
step = require 'stepc'
outcome = require 'outcome'
path  = require "path"

exports.run = (file, next, config) -> require(file).load(config, next)

exports.test = (target) ->
	return /.js$/.test String(target)