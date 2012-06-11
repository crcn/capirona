var structr = require("structr");
require("colors"),
sprintf = require("sprintf").sprintf;

module.exports = structr({

	/**
	 */

	"__construct": function() {
		this.options = {
			verbose: false,
			commands: true
		};
	},

	/**
	 */

	"verbose": function() {
		if(!this.options.verbose) return;
		console.log.apply(null, arguments);
	},

	/**
	 */

	"logCommand": function(command, message) {
		if(!this.options.commands) return;
		console.log("==> ".cyan + command.magenta + " " + message);
	},

	/**
	 */

	"info": function(message) {
		console.log(message.grey);
	}
})