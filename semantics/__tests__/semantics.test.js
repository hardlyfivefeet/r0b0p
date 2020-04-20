/*
 * Semantics Success Test
 *
 * These tests check that the semantic analyzer correctly accepts a program that passes
 * all of semantic constraints specified by the language.
 */

const parse = require("../../ast/parser");
const analyze = require("../analyzer");

const program = String.raw`
SP3AK["Hello, world!"];
num_of_members = 3;
SP3AK[num_of_members];
name = "r0b0p";
SP3AK[name];
AGE_TOTAL = 62;
SP3AK[AGE_TOTAL];
x = b1p;
y = b0p;

list = {1, 2, 3, 4};
SUBST1TUT3[list, 0, 100];
PLAC3_AT[list, 2, 5];
D1SCARD_AT[list, 3];
value = R3TR13V3_AT[list, 0];
SP3AK[value];
list_length = S1Z3[list];
SP3AK[list_length];

dict = {a: 2, b: 3};
PLAC3[dict, "c", 3];
D1SCARD[dict, "a"];
R3TR13V3[dict, "c"];
C0D3S[dict];

x = 3;
PR3SUM1NG[x < 6] <
    SP3AK["x is less than 6!"];
> 3LS3 1F[x == 6] <
    SP3AK["x is 6!"];
> 3LS3 <
    SP3AK["x is greater than 6!"];
>

y = 3;
PR3SUM1NG[y == 1] <
    SP3AK["y is 1!"];
> 3LS3 <
    SP3AK["y is not 1, 2 or 3!"];
>

C0UNT[i:0->10] <
    SP3AK["this will print 10 times, this is the " + i + "th time"];
    PR3SUM1NG[x == 8] <
      SP3AK["Or not! Hah!"];
      D1SC0NT1NU3;
    >
>

C0UNT[0->10] <
    SP3AK["this will also print 10 times!"];
>

x = 0;
WH1L3[x < 6] <
    PR3SUM1NG[x == 3] <
      SP3AK["Not this time..."];
      C0NT1NU3;
    >
    x = x + 1; ...Adding 1 to x!
>

bananas = 3;
SP3AK["I have 'bananas' bananas"];

quote = "Hello, world!";
SP3AK["She said \''quote'\'"];

PR0GRAM area_of_circle[r] <
  G1V3 3.14159265 * r * r;
>

area = area_of_circle[10];
SP3AK[area];

PR0GRAM gcd[a, b] <
  PR3SUM1NG[b == 0] <
    G1V3 a;
  >
  G1V3 gcd[b, (a % b)];
>

x = N0T y;

z = 3;
x = 3 + 6 - z * (6 ** (-1)); 

C0UNT[i:0->10] <
  varInParent = 3;
  PR3SUM1NG[i % 2 == 0] <
      SP3AK[varInParent];
  >
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
  test("accepts the mega program with all syntactic forms", (done) => {
    const astRoot = parse(program);
    expect(astRoot).toBeTruthy();
    analyze(astRoot);
    expect(astRoot).toBeTruthy();
    done();
  });
});
