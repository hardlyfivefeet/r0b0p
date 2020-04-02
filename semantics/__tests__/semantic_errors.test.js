/*
 * Semantic Error Tests
 *
 * These tests check that the analyzer will reject programs with various
 * static semantic errors.
 */

const parse = require("../../ast/parser");
const Context = require("../context");

const errors = [
  // ["use of undeclared variable", "y = x + 6;"],
  // ["non boolean while condition", 'WH1L3["hello"] <  >'],
  // ["non boolean if condition", 'PR3SUM1NG["hello"] < >'],
  // ["non integer in subtract", 'x = "dog" - 5;'],
  ["too many function arguments", 'SP3AK["1", "abc"];'],
  ["too few function arguments", "SP3AK[];"]
  // ["wrong type of function argument", "SP3AK[8];"],
  // ["same key repeated ", "y = {a: 1, a: 2};"],
  // ["no such key", "y = {a: 1, b: 2}; value = R3TR13V3[y, c];"],
  // ["call of nonfunction", "x = 1; x[5];"],
  // ["editing a const variable", "AHHH = 6; AHHH = 92;"]
];

describe("The semantic analyzer", () => {
  errors.forEach(([scenario, program]) => {
    test(`detects the error ${scenario}`, done => {
      const astRoot = parse(program);
      expect(astRoot).toBeTruthy();
      expect(() => astRoot.analyze(Context.INITIAL)).toThrow();
      done();
    });
  });
});
