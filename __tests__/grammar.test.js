let fs = require("fs");
let ohm = require("ohm-js");
let assert = require("assert");

let contents = fs.readFileSync("r0b0p.ohm");
let r0b0p = ohm.grammar(contents);

describe("assignment", () => {
  it("lets us assign an id to a number", () => {
    results = r0b0p.match("x = 3;");
    assert(results.succeeded());
  });
  it("lets us assign an id to an expression", () => {
    results = r0b0p.match("x = (y + 9);");
    assert(results.succeeded());
  });
});

describe("functions", () => {
  it("lets us declare a simple function", () => {
    results = r0b0p.match("PR0GRAM addTwo[x, y] { G1V3 x + y; }");
    assert(results.succeeded());
  });
  it("lets us call a function", () => {
    results = r0b0p.match("SP3AK[addTwo[5, 6]];");
    assert(results.succeeded());
  });
});
