var structr = require("structr"),
beanpoll    = require("beanpoll"),
outcome     = require("outcome"),
path        = require("path"),
_           = require("underscore"),
tpl         = require("./tpl"),
crema       = require("crema"),
traverse    = require("traverse"),
exprUtils   = require("./expression/utils");


const COMMAND_TYPE = "command";


var CommandMessenger = structr(beanpoll.Messenger, {

	/**
	 */

	"_next": function(middleware) {
		this.request.query.defaults(this.request.params);
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
		this.commandInfo = {};
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

	"add": function(expression, exprTarget) {

		if(!expression.routes) throw new Error("routes must be present");

		var routes = expression.routes, 
		router = this._router,
		evaluator = this.evaluator,
		params   = this._parseParams(expression),
		self = this;


		var cmd = routes.map(function(route) {
			return crema.stringify(route, false);
		}).join(" OR ");

		if(expression.description) {
			this.commandInfo[cmd] = {
				command: cmd.replace(/\/+/g, ":"),
				description: expression.description,
				params: params
			};
		}

		var cwd = exprTarget.get("cwd");


		routes.forEach(function(route) {
			route.type = COMMAND_TYPE;
			// console.log(route.path.value)
			router.on(route, function(target, next) {

				//make sure the params are valid
				if(params.length) {
					try {
						self._testParams(target, params, route);
					} catch(e) {
						return next(new Error("command \"" + route.path.value + "\": " + e.message));
					}
				}

				//set the default values
				if(expression.defaults) {
					target.defaults(expression.defaults);
				}

				if(expression.message) {
					self._log(route, expression.message, target);
				}	


				// exprTarget.defaults(target);
				// target.overwrite(exprTarget);

				var v = expression.value;

				if(typeof v != "function") {
					v = traverse(v).clone();
				}

				evaluator.run(expression.constructor.parse(v), target, next);
			});	
		});
	},

	/**
	 */

	"run": function(command, target, next) {
		target.parser = this.parser;
		target.logger = this.logger;
		this._router.request(command.replace(/\:/g,'/')).
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

		for(var i = params.length; i--;) {
			var param = params[i];
			var ret = param.tester.test(target);

			if(((typeof ret == "boolean") && !ret) && param.value) {
				ret = tpl.render(param.value, target.get(false));
			}

			if(!ret) {
				throw new Error("param \"--" + param.property + "\" is invalid or missing");
			}

			if(typeof ret != "boolean") {
				target.set(param.property, ret);
			}

		}

		/*for(var param in params) {
			var tester = this._paramTester(params[param], param),
			ret = tester.test(target);

			if(!ret) {
				throw new Error("param \"--" + param + "\" is invalid or missing");
			}

			if(typeof ret != "boolean") {
				target.set(param, ret);
			}
		}*/
	},


	/**
	 */

	"_parseParams": function(expression) {

		var newParams = [],
		params = expression.params,
		defaults = expression.defaults || {};

		for(var property in params) {
			var param = params[property],
			test, value = defaults[property], description,
			top = typeof param;


			if(top == "string" || top == "function") {
				test = this._paramTester(param, property);
			} else {
				test = this._paramTester(param.test || true, property);
				value = param.value;
				description = param.description;
			}

			newParams.push({
				property: property,
				description: description,
				tester: test,
				value: value
			})

		}

		return newParams;
	},

	/**
	 */

	"_log": function(route, msg, target) {
		var str;

		if(typeof msg == "string") {
			str = tpl.render(msg, target.get(false));
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
					var ref = target.get(param);
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
				return !!target.get(param);
			}
		}
	}
});