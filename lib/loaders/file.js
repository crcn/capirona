(function() {
  var fs, outcome, path, step;

  fs = require('fs');

  step = require('stepc');

  outcome = require('outcome');

  path = require("path");

  exports.run = function(file, next, config) {
    var onResult;
    onResult = outcome.error(next);
    config.cwd = path.dirname(file);
    return step.async(function() {
      return fs.readFile(file, "utf8", this);
    }, onResult.success(function(content) {
      return this(null, JSON.parse(content));
    }), next);
  };

  exports.test = function(target) {
    return typeof target === 'string';
  };

}).call(this);
