var ejs  = require("ejs"),
traverse = require("traverse");

exports.render = function(value, target) {

		var clone = traverse(value).clone();
		var targetClone = traverse(target).clone();
		var dest = {};


		return traverse(clone).forEach(function(x) {


			if(this.key) {
				if(~this.key.indexOf("<%")) {
					this.remove();
				}


				while(~this.key.indexOf("<%")) {
					this.key = ejs.render(this.key, targetClone);
				}
			}
			var rendered = x;
			
			
			if(typeof x == "string") {

				while(~rendered.indexOf("<%")) {
					targetClone[this.key] = rendered = ejs.render(rendered, targetClone);
				}

			} 
			this.update(rendered);


		});
}
