return;
var cap = require(".."),
expect = require("expect.js");

describe("definition test", function() {

  it("can define, and run a simple definition", function(next) {
    cap.run({
      "def hello": {
        "run": function(target) {
          expect(target.get("message")).to.be("hello");
        }
      }
    }).run("hello", { message: "hello" }, next);
  });

  it("can modify a simple message", function(next) {
    var context;
    cap.run({
      "def concat": {
        "run": function(target) {
          target.set("output", target.get("input").join(target.get("delim")));
        }
      }
    }).
    run("concat", context = {
      input: ["a", "b", "c", "c"],
      delim: "+"
    }, function(err) {
      console.log(context)
    })
  })
});