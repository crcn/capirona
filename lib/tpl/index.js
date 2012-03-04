(function() {
  var ejs, render, structr, traverse;

  ejs = require('ejs');

  structr = require('structr');

  traverse = require('traverse');

  render = function(value, data) {
    var clone;
    clone = traverse(value).clone();
    return traverse(clone).forEach(function(x) {
      if (typeof x === 'string') return this.update(ejs.render(x, data));
    });
  };

  exports.render = render;

}).call(this);
