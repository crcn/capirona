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


		expression.routes            = crema(expression.name);

		//gives a defined route the ability for any children routes to be assigned
		//to a different namespace. See use cases with loading tasks
		expression.routes.namespace  = (expression.find("namespace") || {}).value;

		this._inheritPath(expression);

		var task;

		//must have a task to be registered as a command. Just ignore.
		if(!(task = expression.find("run"))) {
			return next();
		}

		delete task.name;

		task.routes    = expression.routes;
		task.namespace = (expression.find("namespace") || {}).value
		task.defaults  = (expression.find("defaults") || {}).value;
		task.params    = (expression.find("params") || {}).value;
		task.message   = (expression.find("message") || {}).value;

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
		var namespace = extend.namespace || "";



		for(var i = extend.length; i--;) {
			for(var j = routes.length; j--;) {
				extended.push(this._merge(routes[j], traverse(extend[i]).clone(), namespace));
			}
		}

		expression.routes = extended;
	},	

	/**
	 */

	"_merge": function(route, parentRoute, namespace) {

		//namespace present? fix the parent route so any children inherit the parent route + the namespace
		//given. 
		if(namespace == "/") {
			parentRoute.path = crema.parsePath("/");
		} else {
			parentRoute.path = crema.parsePath(path.normalize("/" + parentRoute.path.value + "/" + namespace));
		}



		//get the REAL route to the newly defined task
		var realPath = [crema.stringifySegments(parentRoute.path.segments), 
		crema.stringifySegments(route.path.segments)].join("/");

		//parse the new path
		route.path = crema.parsePath(realPath);
		

		var cthru = route.thru;
		var pthru = route;

		//fix all middleware so they're relative to the parent route 
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

	"test": function(expression) {
		return String(expression.name).substr(0, 4) == "def ";
	}
})