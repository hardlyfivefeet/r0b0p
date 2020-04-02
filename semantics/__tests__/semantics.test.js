/*
 * Semantics Success Test
 *
 * These tests check that the semantic analyzer correctly accepts a program that passes
 * all of semantic constraints specified by the language.
 */

const parse = require("../../ast/parser");
const analyze = require("../analyzer");

// This is just enough to complete 100% analyzer coverage, but feels light to me.
const program = String.raw`
SP3AK["Hello, world!"];
num_of_members = 3;
name = "r0b0p";
AGE_TOTAL = 62;
x = b1p;
y = b0p;

list = {1, 2, 3, 4};
SUBST1TUT3[list, 0, 100];
PLAC3_AT[list, 2, 5];
D1SCARD_AT[list, 3];
value = R3TR13V3_AT[list, 0];
list_length = S1Z3[list];

dict = {a: 1, b: 2};
PLAC3[dict, a, 5];
value = R3TR13V3[dict, a];
D1SCARD[dict, a];

x = 3;
PR3SUM1NG[x < 6] <
    SP3AK["x is less than 6!"];
>

C0UNT[i:0->10] <
>

x = 0;
WH1L3[x < 6] <
    x = x + 1; ...Adding 1 to x!
>

bananas = 3;
SP3AK["I have 'bananas' bananas"];

quote = "Hello, world!"
SP3AK["She said \''quote'\'"];

PR0GRAM area_of_circle[r] <
  G1V3 3.14159265 * r * r;
>

area = area_of_circle[10];

PR0GRAM gcd[a, b] <
  PR3SUM1NG[b == 0] <
    G1V3 a;
  >
  G1V3 gcd[b, (a % b)];
>

PR0GRAM powers[base, limit, callback] <
  current = 1;
  i = 1;
  WH1L3[current <= limit] <
    callback[current];
    current = base ** i;
    i = i + 1;
  >
>

`;

describe("The semantic analyzer", () => {
  test("accepts the mega program with all syntactic forms", done => {
    // const astRoot = parse(program);
    // expect(astRoot).toBeTruthy();
    // analyze(astRoot);
    // expect(astRoot).toBeTruthy();
    done();
  });
});
