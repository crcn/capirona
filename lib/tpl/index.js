var ejs  = require("ejs"),
traverse = require("traverse");

exports.render = function(value, target) {

		var clone = traverse(value).clone();
		var targetClone = traverse(target).clone();


		return traverse(clone).forEach(function(x) {
			if(typeof x != "string") return;

			var rendered = x;

			while(~rendered.indexOf("<%")) {
				targetClone[this.key] = rendered = ejs.render(rendered, targetClone);
			}

			this.update(rendered);
		});
}