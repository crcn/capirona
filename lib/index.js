(function() {
  var Config, Loader, TaskFactory, Tasks, crc32, fs, outcome, path, plugin, seq, step, structr, traverse, _;

  fs = require("fs");

  path = require("path");

  step = require("stepc");

  outcome = require("outcome");

  seq = require("seq");

  Tasks = require("./collection");

  traverse = require("traverse");

  Loader = require("./loader");

  TaskFactory = require("./factory");

  _ = require("underscore");

  crc32 = require("crc32");

  plugin = require("plugin");

  structr = require("structr");

  /* 
   the mesh config value object
  */

  Config = (function() {
    /*
    */
    function Config() {
      this._taskFactory = new TaskFactory();
      this._loadPlugins(this._taskFactory, __dirname + "/tasks");
      this._configLoader = new Loader(this);
      this._loadPlugins(this._configLoader, __dirname + "/loaders");
      this._seq = seq();
      this.clear();
    }

    /*
    	 Loads  configuration
    */

    Config.prototype.load = function(source, next) {
      var loaded, self, seqNext;
      self = this;
      seqNext = null;
      loaded = false;
      this._seq.seq(function() {
        seqNext = this;
        if (loaded) return seqNext();
      });
      seq().seq(function() {
        return self._configLoader.load(source, this);
      }).seq(function(config) {
        self._onLoad(config);
        return this();
      }).seq(function() {
        if (next) next.apply(null, arguments);
        return this();
      }).seq(function() {
        loaded = true;
        if (seqNext) return seqNext();
      });
      return this;
    };

    /*
    */

    Config.prototype.next = function(fn) {
      this._seq.seq(fn);
      return this;
    };

    /*
    	 resets the tasks & vars
    */

    Config.prototype.clear = function() {
      this.config = {
        buildId: crc32(String(Date.now()))
      };
      this._tasks = new Tasks(this._taskFactory, this);
      return this;
    };

    /*
    	 loads a config from disc - important because they MAY contain
    	 scripts - in which case we'll need the CWD
    */

    Config.prototype.run = function(paths, target, complete) {
      var self, vars;
      if (typeof target === "function") {
        complete = target;
        vars = {};
      }
      if (!(paths instanceof Array)) paths = [paths];
      self = this;
      return this._seq.seq(function() {
        var next;
        if (target.cwd) self.cwd = target.cwd;
        next = this;
        return seq(paths).seqEach(function(path) {
          var config,
            _this = this;
          config = structr.copy(self.config);
          config = structr.copy(target, config);
          config.task = path;
          return self._run(path, config, function(err) {
            if (err) return complete(err);
            return _this();
          });
        }).seq(function() {
          return next();
        });
      }).seq(function() {
        return complete();
      });
    };

    /*
    */

    Config.prototype._run = function(path, target, next) {
      return this._tasks.run(path, target, next);
    };

    /*
    */

    Config.prototype._onLoad = function(config) {
      var self;
      self = this;
      if (config.cwd) self.cwd = config.cwd;
      traverse(config).forEach(function(v) {
        if (typeof v === 'string' && /^(\.|~)+(\/\w*)+/.test(v)) {
          return this.update(path.normalize(v.replace(/^\./, self.cwd + "/.").replace(/^~/, process.env.HOME + "/")));
        }
      });
      structr.copy(config, this.config);
      if (config.mesh) structr.copy(config.mesh, this.config);
      delete this.config.mesh;
      delete this.config.tasks;
      if (config.mesh) {
        return this._tasks.load(config.mesh.tasks || {});
      } else if (config.tasks) {
        return this._tasks.load(config.tasks);
      }
    };

    /*
    	 loads plugins for task factory, or config loader
    */

    Config.prototype._loadPlugins = function(factory, directories) {
      return plugin.loader().factory(function(plugin) {
        return factory.add(plugin);
      }).require(directories).load();
    };

    return Config;

  })();

  exports.make = function() {
    return new Config();
  };

}).call(this);
