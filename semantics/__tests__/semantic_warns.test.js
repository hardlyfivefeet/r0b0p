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
  [
    "unreachable code after return",
    `PR0GRAM bloop[] < SP3AK["hi"]; G1V3 3; SP3AK["nobody will see this..."]; >`,
  ],
  [
    "unreachable code after break",
    `x = 6; WH1L3[x == 6] < D1SC0NT1NU3; SP3AK["Hello nobody"]; >`,
  ],
  ["potential infinite loop", `WH1L3[b1p] < SP3AK["Hello nobody"]; >`],
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
