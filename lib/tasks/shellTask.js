(function() {
  var BaseTask, ShellTask, exec, parseTpl,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BaseTask = require("./base").Task;

  parseTpl = require("../parseTpl");

  exec = require("child_process").exec;

  /*
   executes a shell script
  */

  module.exports = ShellTask = (function(_super) {

    __extends(ShellTask, _super);

    function ShellTask() {
      ShellTask.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    ShellTask.prototype.load = function(ops) {
      return this.exec = ops.exec;
    };

    /*
    	 passes the build phase
    */

    ShellTask.prototype._run = function(target, next) {
      var cmd;
      cmd = this._cmd(target);
      return exec(cmd, {
        cwd: target.cwd
      }, function(err, stdout, stderr) {
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
        return next();
      });
    };

    /*
    */

    ShellTask.prototype._taskMessage = function(target) {
      return this._cmd(target);
    };

    /*
    */

    ShellTask.prototype._cmd = function(target) {
      return parseTpl(this.exec, target);
    };

    return ShellTask;

  })(BaseTask);

  module.exports.test = function(config) {
    return !!config.exec;
  };

}).call(this);
