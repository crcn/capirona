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

    Config.prototype.load = function(target, next) {
      var self;
      self = this;
      this._seq.seq(function() {
        return self._configLoader.load(target, this);
      }).seq(function(config) {
        self._onLoad(config);
        return this();
      });
      if (next) {
        this.next(function() {
          next.apply(this, arguments);
          return this();
        });
      }
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
      this.vars = {
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
        next = this;
        return seq(paths).seqEach(function(path) {
          var _this = this;
          return self._run(path, structr.copy(self.vars, target), function(err) {
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
      traverse(config).forEach(function(v) {
        if (typeof v === 'string' && /^(\.|~)+(\/\w*)+/.test(v)) {
          return this.update(path.normalize(v.replace(/^\./, self.cwd + "/.").replace(/^~/, process.env.HOME + "/")));
        }
      });
      if (config.tasks) this._tasks.load(config.tasks);
      if (config.vars) return this._loadVars(config.vars);
    };

    /*
    	 loads vars from the vars header config
    */

    Config.prototype._loadVars = function(vars) {
      var trav;
      trav = {
        v: vars
      };
      try {
        traverse(trav).forEach(function(v) {
          try {
            if (typeof v === "string" && fs.lstatSync(v)) {
              return this.update(JSON.parse(fs.readFileSync(v, "utf8")));
            }
          } catch (e) {

          }
        });
      } catch (e) {

      }
      return _.extend(this.vars, trav.v);
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
