(function() {
  var ejs, traverse;

  ejs = require("ejs");

  traverse = require("traverse");

  module.exports = function(buffer, ops) {
    if (typeof buffer === 'object') {
      traverse(buffer).forEach(function(v) {
        if (typeof v === 'string') return this.update(module.exports(v, ops));
      });
      return buffer;
    }
    return handlebars.compile(buffer)(ops);
  };

}).call(this);
