var capirona = require("../");

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

