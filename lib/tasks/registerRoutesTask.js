(function() {
  var BaseTask, RegisterRoutesTask, path, tpl,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BaseTask = require("./base").Task;

  tpl = require("../tpl");

  path = require("path");

  /*
   references another builder
  */

  module.exports = RegisterRoutesTask = (function(_super) {

    __extends(RegisterRoutesTask, _super);

    function RegisterRoutesTask() {
      RegisterRoutesTask.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    RegisterRoutesTask.prototype.load = function(ops) {
      this.ops = ops;
    };

    /*
    	 passes the build phase
    */

    RegisterRoutesTask.prototype._run = function(target, next) {
      this.factory.routes.load(this.ops);
      return next();
    };

    /*
    */

    RegisterRoutesTask.prototype._printMessage = function() {};

    return RegisterRoutesTask;

  })(BaseTask);

  module.exports.test = function(config) {
    return typeof config === "object";
  };

  module.exports.priority = -999;

}).call(this);
