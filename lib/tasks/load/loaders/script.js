(function() {
  var fs, outcome, path, step, vm;

  fs = require('fs');

  step = require('stepc');

  outcome = require('outcome');

  path = require("path");

  vm = require("vm");

  exports.run = function(file, target, next) {
    var script;
    if (file.substr(0, 1) === ".") file = process.cwd() + "/" + file;
    script = require(file);
    if (script.load) {
      return script.load(target, next);
    } else {
      return next(null, script);
    }
  };

  exports.test = function(target) {
    return /.js$/.test(String(target));
  };

}).call(this);
