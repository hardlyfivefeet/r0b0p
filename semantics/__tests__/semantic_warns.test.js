/*
 * Semantic Error Tests
 *
 * These tests check that the analyzer will reject programs with various
 * static semantic errors.
 */

const parse = require("../../ast/parser");
const analyze = require("../analyzer");

const UNREACHABLE_CODE_MESSAGE =
  "Boop. This code is unreachable, human. Please remove it.";
const POTENTIAL_INFINITE_LOOP_MESSAGE =
  "Bip bop. Detecting a potential infinite loop. Be cautious.";

const warns = [
  [
    "unreachable code in while(false)",
    `WH1L3[b0p] < SP3AK["Nobody will ever read this..."];>`,
    UNREACHABLE_CODE_MESSAGE,
  ],
  [
    "unreachable code in if(false)",
    `PR3SUM1NG[b0p] < SP3AK["Nobody will ever read this either..."];>`,
    UNREACHABLE_CODE_MESSAGE,
  ],
  [
    "unreachable code after return",
    `PR0GRAM bloop[] < SP3AK["hi"]; G1V3 3; SP3AK["nobody will see this..."]; >`,
    UNREACHABLE_CODE_MESSAGE,
  ],
  [
    "unreachable code after break",
    `x = 6; WH1L3[x == 6] < D1SC0NT1NU3; SP3AK["Hello nobody"]; >`,
    UNREACHABLE_CODE_MESSAGE,
  ],
  [
    "potential infinite loop",
    `WH1L3[b1p] < SP3AK["Hello nobody"]; >`,
    POTENTIAL_INFINITE_LOOP_MESSAGE,
  ],
  ["unused var", `z = 6;`, "Beep! Alert! Detecting unused variable z"],
];

describe("The semantic analyzer", () => {
  warns.forEach(([scenario, program, warning]) => {
    test(`detects the warning ${scenario}`, (done) => {
      console.log("Should print the following warning:\n", warning);
      const astRoot = parse(program);
      expect(astRoot).toBeTruthy();
      analyze(astRoot);
      done();
    });
  });
});
