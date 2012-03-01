### Example make.json file:

```javascript
{
	"tasks": {
		
		"web:*": {
			"make:{{task}} -> debug:{{task}}": {
				"log": "make {{task}}"
			}
		},
		"make:task": {
			"log": "make task!"
		},
		"make:blarg": {
			"log": "make blarg!"
		},
		"make:{{task}}": {
			"log": "make custom task: {{task}}!"
		}
	}
}	
```

In terminal:

```
capirona web:make:task
```

Output:

```
---> make make/task
make task!
---> make web/debug/:task
make task
done without errors
```


### Usage

```
Usage: capirona [targets] -i=[target] --arg=[value]

Options:
  -i, --input  [default: "./make.json"]
```