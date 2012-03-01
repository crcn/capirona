(function() {
  var BaseTask, IncludeTask, fs,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BaseTask = require("./base").Task;

  fs = require("fs");

  /*
   builds from a .js file
  */

  module.exports = IncludeTask = (function(_super) {

    __extends(IncludeTask, _super);

    function IncludeTask() {
      IncludeTask.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    IncludeTask.prototype.load = function(ops) {
      var cfg;
      cfg = JSON.parse(fs.readFileSync(ops.include, "utf8"));
      return this.tasks.load(cfg, [this.route]);
    };

    /*
    	 passes the build phase @
    */

    IncludeTask.prototype._run = function(target, next) {
      throw new Error("Cannot call target builder");
    };

    return IncludeTask;

  })(BaseTask);

  module.exports.test = function(config) {
    return !!config.include;
  };

}).call(this);
