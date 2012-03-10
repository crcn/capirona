(function() {
  var BaseTask, LoadTask, fs, path, plugin, structr, tpl,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BaseTask = require("../base").Task;

  fs = require("fs");

  structr = require("structr");

  path = require("path");

  tpl = require("../../tpl");

  plugin = require("plugin");

  /*
   builds from a .js file
  */

  module.exports = LoadTask = (function(_super) {

    __extends(LoadTask, _super);

    function LoadTask() {
      LoadTask.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    LoadTask.prototype.init = function() {
      var _this = this;
      this._loaders = [];
      return plugin.loader().factory(function(plugin) {
        return _this._loaders.push(plugin);
      }).require(__dirname + "/loaders").load();
    };

    /*
    */

    LoadTask.prototype.load = function(ops) {
      this._loader = this._findLoader(ops.load);
      this.cfg = ops.load;
      return this.cfgDir = path.dirname(this.load);
    };

    /*
    	 passes the build phase @
    */

    LoadTask.prototype._run = function(target, next) {
      var _this = this;
      if (!target.cwd) target.cwd = process.cwd();
      return this._loader.run(this.cfg, next.success(function(config) {
        return _this.childTask(null, config).run(target, next);
      }));
    };

    /*
    */

    LoadTask.prototype._taskMessage = function(target) {
      return "loading ./" + (path.relative(this.cfgDir, this._cfgPath(target)));
    };

    /*
    */

    LoadTask.prototype._cfgPath = function(target) {
      return tpl.render(this.cfg, target);
    };

    /*
    */

    LoadTask.prototype._findLoader = function(ops) {
      var loader, _i, _len, _ref;
      _ref = this._loaders;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        loader = _ref[_i];
        if (loader.test(ops)) return loader;
      }
    };

    return LoadTask;

  })(BaseTask);

  module.exports.test = function(config) {
    return !!config.load;
  };

  module.exports.priority = 0;

}).call(this);
