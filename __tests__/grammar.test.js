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

describe("loops", () => {
  it("lets us write a conditional statement", () => {
    results = r0b0p.match("i = 3; PR3SUM1NG[i < 5] { z = 3 + 6; } 3LS3 1F[i > 7] { z = 1 + i; } 3LS3 { z = 4; }");
    assert(results.succeeded());
  });
  it("lets us call a for-loop", () => {
    results = r0b0p.match("C0UNT[i:0->10] { SP3AK[i]; }");
    assert(results.succeeded());
  });
});