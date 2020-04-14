/*
 * Semantic Error Tests
 *
 * These tests check that the analyzer will reject programs with various
 * static semantic errors.
 */

const parse = require("../../ast/parser");
const Context = require("../context");

const errors = [
  ["use of undeclared variable", "y = x + 6;"],
  [
    "use of declared variable outside the inner block",
    "PR0GRAM declare_x[] < x = 3; > SP3AK[x];",
  ],
  ["same key repeated", "y = {a: 1, a: 2};"],
  [
    "wrong number of parameters",
    "PR0GRAM area_of_circle[r] < G1V3 3.14159265 * r * r; > x = area_of_circle[];",
  ],
  ["call of nonfunction", "x = 3; x[5];"],
  ["editing a const variable", "A = 6; A = 92;"],
  ["using break outside of a loop", "D1SC0NT1NU3;"],
  ["using continue outside of a loop", "C0NT1NU3;"],
  ["using return outside of a function", "x = 3; G1V3 x;"],
  [
    "calling a nonfunction and nonparameter as a function",
    "PR0GRAM powers[base, limit, callback] < x[]; >",
  ],
  [
    "assigning a function to a declared variable",
    "z = 3; PR0GRAM z[] < G1V3 20; >",
  ],
  [
    "assigning a variable to a declared function",
    "PR0GRAM z[] < G1V3 20; > z = 3;",
  ],
];

describe("The semantic analyzer", () => {
  errors.forEach(([scenario, program]) => {
    test(`detects the error ${scenario}`, (done) => {
      const astRoot = parse(program);
      expect(astRoot).toBeTruthy();
      expect(() => astRoot.analyze(Context.INITIAL)).toThrow();
      done();
    });
  });
});
