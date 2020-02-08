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

describe("conditionals and loops", () => {
  it("lets us write a conditional statement", () => {
    results = r0b0p.match("i = 3; PR3SUM1NG[i < 5] { z = 3 + 6; } 3LS3 1F[i > 7] { z = 1 + i; } 3LS3 { z = 4; }");
    assert(results.succeeded());
  });
  it("lets us call a for-loop", () => {
    results = r0b0p.match("C0UNT[i:0->10] { SP3AK[i]; }");
    assert(results.succeeded());
  });
});

describe("strings", () => {
  it("lets us create a string variable", () => {
    results = r0b0p.match('x = "hello, world!";');
    assert(results.succeeded());
  });
  it("lets us concatenate strings", () => {
    results = r0b0p.match('x = "hello," + " world!";');
    assert(results.succeeded());
  });
});

describe("lists and dictionaries", () => {
  it("lets us create a dictionary variable", () => {
    results = r0b0p.match("x = {a: 1, b: 2};");
    assert(results.succeeded());
  });
  it("lets us create a list variable", () => {
    results = r0b0p.match("x = {1, 2};");
    assert(results.succeeded());
  });
});
