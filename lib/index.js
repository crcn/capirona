(function() {
  var RootTask, TaskFactory, crc32, plugin;

  TaskFactory = require("./factory");

  crc32 = require("crc32");

  plugin = require("plugin");

  require("colors");

  require("colorcode").code(/^(==> )/, "$1".bold.cyan).error(function(msg) {
    return msg.bold.red;
  }).info(function(msg) {
    return msg.grey;
  })["export"](console);

  /* 
   the mesh config value object
  */

  RootTask = (function() {
    /*
    */
    function RootTask(rawTasks) {
      this.taskFactory = new TaskFactory(this);
      this._loadPlugins(this.taskFactory, __dirname + "/tasks");
      this.entryTask = this.taskFactory.newTask(null, rawTasks);
    }

    /*
    	 loads a config from disc - important because they MAY contain
    	 scripts - in which case we'll need the CWD
    */

    RootTask.prototype.run = function(target, complete) {
      if (typeof target === 'function') {
        complete = target;
        target = {};
      }
      target.buildId = crc32(String(Date.now()));
      return this.entryTask.run(target, complete);
    };

    /*
    	 loads plugins for task factory, or config loader
    */

    RootTask.prototype._loadPlugins = function(factory, directories) {
      return plugin.loader().factory(function(plugin) {
        return factory.add(plugin);
      }).require(directories).load();
    };

    return RootTask;

  })();

  exports.make = function() {
    return new RootTask(Array.apply([], arguments));
  };

}).call(this);
