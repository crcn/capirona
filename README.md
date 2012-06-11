Javascript Tasks

### Example task:

```javascript
var capirona = require("capirona");

capirona.make({
	"def hello/:name": {
		"run": function(target, next) {
			console.log("hello %s!", target.data.name);
			next();	
		}
	}
}, "hello/craig").run(function() {
	console.log("done");
});
```


### API

#### Task .make(task)

creates a new runnable script

#### Task.run(target, callback)

runs the given task. The target can be any value. For example:

```javascript

capirona.make({
	"def log": {
		"run": function(target, next) {
			console.log(target.value);
		}
	}	
}, "log").run(

```



