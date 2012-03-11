(function() {
  var BaseTask, LoadTask, fs, path, plugin, structr, tpl,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  fs = require("fs");

  tpl = require("../../tpl");

  path = require("path");

  plugin = require("plugin");

  structr = require("structr");

  BaseTask = require("../base").Task;

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
      if (!this.factory.__loadedScripts) this.factory.__loadedScripts = {};
      return plugin.loader().factory(function(plugin) {
        return _this._loaders.push(plugin);
      }).require(__dirname + "/loaders").load();
    };

    /*
    */

    LoadTask.prototype.load = function(ops) {
      this.cfg = ops.load;
      this.cwd = ops.cwd;
      return this.cfgDir = path.dirname(this.cfg);
    };

    /*
    	 passes the build phase @
    */

    LoadTask.prototype._run = function(target, next) {
      var pt,
        _this = this;
      target.cwd = this._findCwd();
      pt = fs.realpathSync(this._cfgPath(target));
      this.liveDir = path.dirname(pt);
      if (this.factory.__loadedScripts[pt]) return next();
      this.factory.__loadedScripts[path] = true;
      return this._findLoader(pt).run(pt, target, next.success(function(config) {
        if (_this.cwd) target.cwd = tpl.render(_this.cwd, target);
        console.log(target.cwd);
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

    LoadTask.prototype._findCwd = function() {
      var cp, cwd;
      cp = this.parent;
      while (cp) {
        cwd = cp.liveDir;
        cp = cp.parent;
        if (cwd) break;
      }
      return cwd || process.cwd();
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
