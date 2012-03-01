(function() {
  var BaseTask, TargetTask, parseTpl, structr,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BaseTask = require("./base").Task;

  structr = require("structr");

  parseTpl = require("../parseTpl");

  /*
   the ENTRY point into the build system
  */

  module.exports = TargetTask = (function(_super) {

    __extends(TargetTask, _super);

    function TargetTask() {
      TargetTask.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    TargetTask.prototype.load = function(target) {
      this.target = target;
      return this.task = this.tasks.factory.newTask(null, this.target.task);
    };

    /*
    	 passes the build phase
    */

    TargetTask.prototype._run = function(target, next) {
      var obj;
      obj = {};
      structr.copy(target, obj);
      structr.copy(this.target, obj);
      obj = parseTpl(obj, target);
      return this.task.run(obj, next);
    };

    /*
    */

    TargetTask.prototype._taskMessage = function(target) {
      return "target " + (this.route.path.value || target.name || "");
    };

    /*
    */

    TargetTask.prototype._pointer = function() {
      return "";
    };

    return TargetTask;

  })(BaseTask);

  module.exports.test = function(config) {
    return !!config.task;
  };

}).call(this);
