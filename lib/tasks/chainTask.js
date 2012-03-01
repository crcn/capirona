(function() {
  var BaseTask, ChainedTask, outcome, seq, structr,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  seq = require("seq");

  BaseTask = require("./base").Task;

  outcome = require("outcome");

  structr = require("structr");

  /*
   a chain of builders
  
   Example:
  
   "firefox":["combine","compile-firefox"]
  */

  module.exports = ChainedTask = (function(_super) {

    __extends(ChainedTask, _super);

    function ChainedTask() {
      ChainedTask.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    ChainedTask.prototype.load = function(chains) {
      var rawTask, _i, _len, _results;
      this.chains = [];
      _results = [];
      for (_i = 0, _len = chains.length; _i < _len; _i++) {
        rawTask = chains[_i];
        _results.push(this.chains.push(this.tasks.factory.newTask(null, rawTask)));
      }
      return _results;
    };

    /*
    */

    ChainedTask.prototype._run = function(target, next) {
      var self;
      self = this;
      return seq(this.chains).seqEach(function(chain) {
        var _this = this;
        return chain.run(target, outcome.error(next).success(function() {
          return _this();
        }));
      }).seq(function() {
        return next();
      });
    };

    return ChainedTask;

  })(BaseTask);

  module.exports.test = function(config) {
    return config instanceof Array;
  };

}).call(this);
