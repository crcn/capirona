var fs = require("fs");

module.exports = function(dir) {

	var files = fs.readdirSync(dir),
	exprs = [];

	for(var i = files.length; i--;) {
		var fileName = files[i];
		if(fileName == "index.js" || fileName == ".DS_Store") continue;
		exprs.push(require(dir + "/" + fileName));
	}

	return exprs;
}