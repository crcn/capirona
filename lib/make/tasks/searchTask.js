(function() {
  var BaseTask, SearchTask, async, handlebars, outcome, structr, walkr,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  async = require("async");

  BaseTask = require("./base").Task;

  handlebars = require("handlebars");

  walkr = require("walkr");

  structr = require("structr");

  outcome = require("outcome");

  /*
   the ENTRY point into the build system
  */

  module.exports = SearchTask = (function(_super) {

    __extends(SearchTask, _super);

    function SearchTask() {
      SearchTask.__super__.constructor.apply(this, arguments);
    }

    /*
    */

    SearchTask.prototype.load = function(options) {
      var search, tasks, _results;
      this.dir = options.directory;
      tasks = this.findTasks = [];
      _results = [];
      for (search in options.find) {
        _results.push(tasks.push({
          search: new RegExp(search),
          task: this.tasks.factory.newTask(search, options.find[search])
        }));
      }
      return _results;
    };

    /*
    	 passes the build phase
    */

    SearchTask.prototype._run = function(target, next) {
      var _this = this;
      return walkr(this.dir).filter(function(options, next) {
        var filt, _i, _len, _ref;
        _ref = _this.findTasks;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          filt = _ref[_i];
          if (filt.search.test(options.source)) {
            return filt.task.run(structr.copy(target, {
              file: options.source
            }), next.success(function() {
              return next();
            }));
          }
        }
        return next();
      }).start(next);
    };

    /*
    */

    SearchTask.prototype._printMessage = function() {};

    return SearchTask;

  })(BaseTask);

  module.exports.test = function(config) {
    return !!config.directory && !!config.find;
  };

}).call(this);
