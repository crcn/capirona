var structr = require("structr"),
beanpoll    = require("beanpoll"),
outcome     = require("outcome"),
path        = require("path"),
dref        = require("dref"),
_           = require("underscore"),
tpl         = require("./tpl");


const COMMAND_TYPE = "command";


var CommandMessenger = structr(beanpoll.Messenger, {

	/**
	 */

	"_next": function(middleware) {
		structr.copy(this.request.params, this.request.query.data);
		var self = this;
		middleware.listener.call(this, this.request.query, this.response.success(function(result) {
			if(!self.next()) {
				self.response.end({
					result: result
				});
			}
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
		this.parser = evaluator.parser;
		this.logger = evaluator.parser.logger;
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
		evaluator = this.evaluator,
		self = this;

		routes.forEach(function(route) {
			route.type = COMMAND_TYPE;
			router.on(route, function(target, next) {



				//make sure the params are valid
				if(expression.params) {
					try {
						self._testParams(target, expression.params, route);
					} catch(e) {
						return next(new Error("command \"" + route.path.value + "\": " + e.message));
					}
				}

				//set the default values
				if(expression.defaults) {
					_.defaults(target.data, expression.defaults);
				}

				if(expression.message) {
					self._log(route, expression.message, target);
				}

				evaluator.run(expression, target, next);
			});	
		});
	},

	/**
	 */

	"run": function(command, target, next) {
		target.parser = this.parser;
		target.logger = this.logger;
		this._router.request(command).
		query(target).
		error(next).
		success(function(resp) {
			next(null, resp.result);
		}).
		dispatch(COMMAND_TYPE);
	},

	/**
	 */

	"_testParams": function(target, params, route) {
		for(var param in params) {
			var tester = this._paramTester(params[param], param),
			ret = tester.test(target);

			if(!ret) {
				throw new Error("param \"--" + param + "\" is invalid or missing");
			}

			if(typeof ret != "boolean") {
				dref.set(target.data, param, ret);
			}
		}
	},

	/**
	 */

	"_log": function(route, msg, target) {
		var str;

		if(typeof msg == "string") {
			str = tpl.render(msg, target.data);
		} else {
			str = msg(target) || "";
		}


		this.logger.logCommand(route.path.value, str);
	},

	/**
	 */

	"_paramTester": function(tester, param) {
		if(tester instanceof RegExp) {
			return {
				test: function(target) {
					var ref = dref.get(target.data, param);
					return !!ref && value.test(String(ref));
				}
			};
		} 

		if(typeof tester == "function") {
			return {
				test: tester
			}
		}

		return {
			test: function(target) {
				return !!dref.get(target.data, param);
			}
		}
	}
});