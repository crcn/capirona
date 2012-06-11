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
}).run("hello/craig", function() {
	console.log("done");
});
```


### API

#### .make(task)

creates a new runnable script

#### .run(command, target, callback)

runs the given task. The target can be any value. For example:

```javascript

capirona.make({
        "def log": {
                "run": function(target, next) {
                        console.log(target.value || target.data.text);
                        next();
                }
        }
}).
run("log", "hello world!").
run("log", {
	text: "hello world!"
});
```



