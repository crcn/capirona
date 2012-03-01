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