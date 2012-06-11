var fs = require("fs");
var files = fs.readdirSync(__dirname),
exprs = [];

for(var i = files.length; i--;) {
	var fileName = files[i];
	if(fileName == "index.js" || fileName == ".DS_Store") continue;
	exprs.push(require(__dirname + "/" + fileName));
}

module.exports = exprs;