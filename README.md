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
		"make:{{target}}": {
			"log": "MAAAAKE {{target}}"
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
---> make make/:target
MAAAAKE task
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