

//parsing a config file
function make(rawTasks) {

	//parse out the config
	var cfg = Config.parse(rawTasks);

	new Factory().load(cfg);
}