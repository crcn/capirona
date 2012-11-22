var capirona = require("../");

capirona.run([{
        "log": "hello"
},
{
	"log": "hello2"
}]).
run("log", "hello world!").
run("log", {
	text: "hello world!"
});

