var ejs  = require("ejs"),
traverse = require("traverse");

exports.render = function(value, data) {

		var clone = traverse(value).clone();
		var clonedData = traverse(data).clone();
		var dest = {};


		return traverse(clone).forEach(function(x) {


			if(this.key) {
				if(~this.key.indexOf("<%")) {
					this.remove();
				}


				while(~this.key.indexOf("<%")) {
					this.key = ejs.render(this.key, clonedData);
				}
			}
			var rendered = x;
			
			
			if(typeof x == "string") {

				while(~rendered.indexOf("<%")) {
					clonedData[this.key] = rendered = ejs.render(rendered, clonedData);
				}

			} 
			this.update(rendered);


		});
}
