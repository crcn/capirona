(function() {
  var fs, outcome, step;

  fs = require('fs');

  step = require('stepc');

  outcome = require('outcome');

  exports.run = function(file, next) {
    var onResult;
    onResult = outcome.error(next);
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
