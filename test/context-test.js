var cap = require(".."),
expect = require("expect.js");

describe("definition test", function() {

  var contexts = {};

  it("can define a context", function() {
    contexts.root = new cap.Context({
      name: {
        first: "craig",
        last: "condon"
      }
    });
  });

  it("can fetch a first name", function() {
    expect(contexts.root.get("name.first")).to.be("craig");
  });


  it("can define a child context", function() {
    contexts.child = contexts.root.child({
      address: {
        "city": "San Francisco"
      }
    });
  });

  it("can fetch the city from the child context", function() {
    expect(contexts.child.get("address.city")).to.be("San Francisco");
  });


  it("can fetch the name from the child context", function() {
    expect(contexts.child.get("name.first")).to.be("craig");
  });

  it("can set the name of the child context, and be reflected in the root context", function() {
    contexts.child.set("name.first", "john");
    expect(contexts.root.get("name.first")).to.be("john");
  });


  it("can set an object to the  child context, and reflect in the root", function() {
    contexts.child.set({
      name: {
        first: "Liam",
        last: "Don"
      },
      address: {
        city: "San Francisco"
      }
    });
    expect(contexts.root.get("name.first")).to.be("Liam");
    expect(contexts.root.get("address.city")).to.be(undefined);
    expect(contexts.child.get("address.city")).to.be("San Francisco");
  })
});