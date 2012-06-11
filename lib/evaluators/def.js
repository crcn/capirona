var BaseEvaulator = require("../base/evaluator"),
exprUtils         = require("../expression/utils"),
crema             = require("crema"),
path              = require("path"),
traverse          = require("traverse");


module.exports = BaseEvaulator.extend({

	/**
	 */

	"priority": 999,

	/**
	 */

	"run": function(expression, target, next) {


		expression.routes = crema(expression.name);

		this._inheritPath(expression);

		var task;

		//must have a task to be registered as a command. Just ignore.
		if(!(task = expression.find("run"))) {
			return next();
		}

		delete task.name;

		task.routes   = expression.routes;
		task.defaults = (expression.find("defaults") || {}).value;
		task.params   = (expression.find("params") || {}).value;

		this.evaluator.commands.add(task);

		//continue, but DON'T traverse
		next(null, false);
	},

	/**
	 * finds the entire path to the given command
	 */

	"_inheritPath": function(expression) {
		var self = this;

		var closestParent = expression.parent();
		while(closestParent && !closestParent.routes) {
			closestParent = closestParent.parent();
		}

		if(!closestParent) return;

		var routes = expression.routes;
		var extend = closestParent.routes;
		var extended = [];

		for(var i = extend.length; i--;) {
			for(var j = routes.length; j--;) {
				extended.push(this._merge(routes[j], traverse(extend[i]).clone()));
			}
		}

		expression.routes = extended;
	},	

	/**
	 */

	"_merge": function(route, parentRoute, routeMiddleware, parentMiddleware) {

		var realPath = [crema.stringifySegments(parentRoute.path.segments), 
		crema.stringifySegments(route.path.segments)].join("/");


		route.path = crema.parsePath(realPath);
		
		var cthru = route.thru;
		var pthru = route;

		while(cthru) {
			cthru.path = this._fixThru(cthru.path, parentRoute.path);
			pthru = cthru;
			cthru = cthru.thru;
		}

		pthru.thru = parentRoute.thru; 


		return route;
	},

	/**
	 */

	"_fixThru": function(thru, parent) {

		var fixedPath  = thru.value;

		if(thru.value.substr(0, 1) == ".") {
			fixedPath = parent.value + "/" + thru.value;
		}
		return crema.parsePath(path.normalize(fixedPath));
	},

	/**
	 */

	"test": function(target) {
		return String(target.name).substr(0, 4) == "def ";
	}
})