var structr = require("structr"),
beanpoll    = require("beanpoll"),
outcome     = require("outcome"),
path        = require("path");


const COMMAND_TYPE = "command";


var CommandMessenger = structr(beanpoll.Messenger, {

	/**
	 */

	"_next": function(middleware) {
		structr.copy(this.flattenData(true), this.request.query.data);
		var self = this;
		middleware.listener.call(this, this.request.query, this.response.success(function() {
			self.next();
		}))
	}
});

var CommandDirector = structr(beanpoll.Director, {

	/**
	 */

	"_newMessenger": function(request, middleware) {
		return new CommandMessenger(request, middleware, this);
	}
});





var Commands = module.exports = structr({

	/**
	 */

	"__construct": function(evaluator) {
		this.evaluator = evaluator;
		var router = this._router = beanpoll.router();
		

		this._router.use(function() {
			return {
				name: COMMAND_TYPE,
				director: new CommandDirector(COMMAND_TYPE, router)
			};
		});
	},

	/**
	 */

	"add": function(expression) {
		if(!expression.routes) throw new Error("routes must be present");

		var routes = expression.routes, 
		router = this._router,
		evaluator = this.evaluator;

		for(var i = routes.length; i--;) {
			var route = routes[i];
			route.type = COMMAND_TYPE;
			router.on(route, function(target, next) {
				evaluator.run(expression, target, next);
			});
		}
	},

	/**
	 */

	"run": function(command, target, next) {
		this._router.request(command).
		query(target).
		next(function() {
			this.response.end();
		}).
		response(next).
		dispatch(COMMAND_TYPE);

	}
});