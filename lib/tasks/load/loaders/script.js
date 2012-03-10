(function() {
  var fs, outcome, path, step;

  fs = require('fs');

  step = require('stepc');

  outcome = require('outcome');

  path = require("path");

  exports.run = function(file, next) {
    if (file.substr(0, 1) === ".") file = process.cwd() + "/" + file;
    return require(file).load(null, next);
  };

  exports.test = function(target) {
    return /.js$/.test(String(target));
  };

}).call(this);
