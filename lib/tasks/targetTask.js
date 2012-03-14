(function() {
  var BaseTask, TargetTask, structr, tpl, watch_r,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BaseTask = require("./base").Task;

  structr = require("structr");

  tpl = require("../tpl");

  watch_r = require("watch_r");

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
      this.task = this.childTask(null, target.task || target.tasks || target.commands);
      this.watch = target.watch;
      this.timeout = target.timeout;
      delete target.tasks;
      return delete target.commands;
    };

    /*
    	 passes the build phase
    */

    TargetTask.prototype._run = function(target, next) {
      var newConfig, obj, oldConfig, renderedConfig;
      obj = {};
      oldConfig = structr.copy(target);
      newConfig = this.target;
      oldConfig = structr.copy(newConfig, oldConfig);
      renderedConfig = tpl.render(newConfig, oldConfig);
      target = structr.copy(renderedConfig, target);
      this.currentData = target;
      obj = target;
      return this._run2(obj, next);
    };

    /*
    */

    TargetTask.prototype._watch = function(target) {
      var _this = this;
      if (this._watcher) this._watcher.dispose();
      this._watcher = void 0;
      console.log("GG");
      return watch_r(this.watch, function(err, watcher) {
        _this._watcher = watcher;
        return watcher.on("change", function(target) {
          return _this._run2(target);
        });
      });
    };

    /*
    */

    TargetTask.prototype._run2 = function(target, next) {
      var _this = this;
      return this.task.run(target, function() {
        if (next) next.apply(_this, arguments);
        if (_this.watch) return _this._watch(target);
      });
    };

    /*
    */

    TargetTask.prototype._printMessage = function() {};

    return TargetTask;

  })(BaseTask);

  module.exports.test = function(config) {
    return !!config.task || !!config.tasks || !!config.commands;
  };

}).call(this);
