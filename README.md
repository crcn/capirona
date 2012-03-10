### JavaScript Build System

This is the build system used for [mesh](/crcn/mesh).

### Example make.json file:

```javascript
{
	"tasks": {
		"web": {
			"say/hello -> debug/:task": {
				"log": "make <%=task %>"
			}
		},
		"say/hello": {
			"log": "hello world!"
		}
	}
}	
```

### Usage


A raw make config:

```javascript
var capirona = require('capirona');


capirona.make({
	task: {
		"hello/:name": {
			"log": "hello <%-name %>!"
		}	
	}
}).run('hello:world', function(err, result) {
	
});

```

Loading configs from file:

```javascript

capirona.make({
	task: {
		"load": __dirname + "./make.json"
	}
}).run('hello:world', function() {
	
})



### API

#### .make(config) 

Creates a new make object


### .run(target, callback)

Runs the loaded task

### Syntax

