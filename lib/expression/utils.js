exports.parentChain = function(config, max) {

	var parents = [],
	parent = config;

	while(parent && (isNaN(max) || parents.length < max)) {
		parents.push(parent);
		parent = parent.parent();
	}

	return parents.reverse();
}

exports.findCwd = function(config) {

	while(config.parent() && !config.cwd) {
		config = config.parent();
	}

	return config.cwd;
}