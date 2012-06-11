var capirona = require("../");

capirona.run([{
        "log": "hello"
},
{
	"log": "hello"
}]).
run("log", "hello world!").
run("log", {
	text: "hello world!"
});

