var ejs  = require("ejs"),
traverse = require("traverse"),
fs = require("fs"),
path = require("path");

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

				var fc = x.substr(0, 1);

				if(fc == "." || fc == "~") {
					var cwd = clonedData.cwd || process.cwd(),
					newPath = path.normalize(rendered.replace(/^\./, cwd + "/").replace(/^\~/, process.env.HOME + "/"));

					try {
						fs.lstatSync(newPath);
						rendered = newPath;
					} catch(e) { }
				}

			} 
			this.update(rendered);


		});
}
