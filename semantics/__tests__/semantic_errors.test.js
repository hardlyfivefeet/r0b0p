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
  ["same key repeated", "y = {a: 1, a: 2};"],
  [
    "wrong number of parameters",
    "PR0GRAM area_of_circle[r] < G1V3 3.14159265 * r * r; > x = area_of_circle[];",
  ],
  ["call of nonfunction", "x = 3; x[5];"],
  ["editing a const variable", "A = 6; A = 92;"],
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
