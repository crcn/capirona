var capirona = require("../");

capirona.make({
        "log": "hello"
},
{
	"log": "hello"
}).
run("log", "hello world!").
run("log", {
	text: "hello world!"
});

