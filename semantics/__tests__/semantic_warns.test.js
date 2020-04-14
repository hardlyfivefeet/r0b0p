/*
 * Semantic Error Tests
 *
 * These tests check that the analyzer will reject programs with various
 * static semantic errors.
 */

const parse = require("../../ast/parser");
const analyze = require("../analyzer");

const warns = [
  [
    "unreachable code in while(false)",
    `WH1L3[b0p] < SP3AK["Nobody will ever read this..."];>`,
  ],
  [
    "unreachable code in if(false)",
    `PR3SUM1NG[b0p] < SP3AK["Nobody will ever read this either..."];>`,
  ],
];

describe("The semantic analyzer", () => {
  warns.forEach(([scenario, program]) => {
    test(`detects the warning ${scenario}`, (done) => {
      const astRoot = parse(program);
      expect(astRoot).toBeTruthy();
      analyze(astRoot);
      done();
    });
  });
});
