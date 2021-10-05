const {
    getPathToValue,
    setValueForPath,
    getValueForPath
  } = require("../core/create/lib/object");

// TODO: add more tests

describe("getPathToValue", () => {
  it("should return the path to the value", () => {
    const o = { biz: { boo: { boo: { foo: { bar: "bar" } } } }, foo: "bar" };

    expect(getPathToValue("bar", o)).toEqual(["biz", "boo", "boo", "foo", "bar"]);
  });
});

describe("setValueForPath", () => {
  it("should set the value of the object on the specified path", () => {
    const o = { biz: { boo: { boo: { foo: { bar: "bar" } } } }, foo: "bar" };

    setValueForPath("boo", ["biz", "boo", "boo", "foo", "bar"], o);

    expect(o).toEqual({ biz: { boo: { boo: { foo: { bar: "boo" } } } }, foo: "bar" });
  });
});

describe("getValueForPath", () => {
  it("should return the value of the specified path", () => {
    const o = { biz: { boo: { boo: { foo: { bar: "bar" } } } }, foo: "bar" };

    
    expect(getValueForPath(["biz", "boo", "boo", "foo", "bar"], o)).toEqual("bar");
  });

  it("should return null if it can't find the value", () => {
    const o = { biz: { boo: "foo" }, foo: "bar" };

    
    expect(getValueForPath(["biz", "boo", "foo"], o)).toEqual(null);
  });
});


