
/*
 base builder interface
*/

(function() {

  exports.Task = (function() {
    /*
    */
    function _Class(route, tasks, parent) {
      this.route = route;
      this.tasks = tasks != null ? tasks : null;
      this.parent = parent != null ? parent : null;
    }

    /*
    	 load from raw config
    */

    _Class.prototype.load = function(ops) {};

    /*
    	 start the build phase
    */

    _Class.prototype.run = function(target, next) {
      if (this.route) {
        target.namespace = this.route.path.value;
        target.currentTask = this.route.path.value.split('/').pop();
      }
      this._printMessage(target);
      return this._run(target, next);
    };

    /*
    */

    _Class.prototype._run = function(target, next) {};

    /*
    */

    _Class.prototype._printMessage = function(target) {
      var message;
      message = this._taskMessage(target);
      if (message) return console.log("" + (this._pointer()) + message);
    };

    /*
    */

    _Class.prototype._taskMessage = function(target) {
      if (this.route) return "make " + target.currentPath;
    };

    /*
    */

    _Class.prototype._pointer = function() {
      return "---> ";
    };

    return _Class;

  })();

  module.exports.test = function() {
    return false;
  };

}).call(this);
