
/*
 base builder interface
*/

(function() {

  exports.Task = (function() {
    /*
    */
    function _Class(route, tasks) {
      this.route = route;
      this.tasks = tasks != null ? tasks : null;
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
      return console.log("" + (this._pointer()) + (this._taskMessage(target)));
    };

    /*
    */

    _Class.prototype._taskMessage = function(target) {
      if (this.route) return "make " + this.route.path.value;
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
