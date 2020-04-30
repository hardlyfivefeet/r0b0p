/* eslint no-undef: 0 */

let fs = require("fs");
let ohm = require("ohm-js");
let assert = require("assert");

let contents = fs.readFileSync(__dirname + "/../r0b0p.ohm");
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
  it("does not let us assign a number to a keyword", () => {
    results = r0b0p.match("S1Z3 = 3;");
    assert(results.succeeded() === false);
  });
  it("does not let us assign an id to a statement", () => {
    results = r0b0p.match('x = SP3AK["This is a statement"];');
    assert(results.succeeded() === false);
  });
});

describe("types", () => {
  it("let us check if something is unclear/undefined", () => {
    results = r0b0p.match("PR3SUM1NG[x == uncl3ar] < SP3AK[5]; >");
    assert(results.succeeded());
  });
  it("let us declare something as unclear/undefined", () => {
    results = r0b0p.match("x = uncl3ar;");
    assert(results.succeeded());
  });
});

describe("comments", () => {
  it("lets us write nonsense in a comment", () => {
    results = r0b0p.match("...asldweroipuqwerpou");
    assert(results.succeeded());
  });
  it("does not let us write a comment in the middle of a statement", () => {
    results = r0b0p.match("x = ...comment5;");
    assert(results.succeeded() === false);
  });
});

describe("math", () => {
  it("lets us use operations such as +, -, *, /", () => {
    results = r0b0p.match("y = (5 * 9 / (54 % 10 + 33) - 1);");
    assert(results.succeeded());
  });
  it("does not let us use math operations on statements", () => {
    results = r0b0p.match('x = 5 + SP3AK["This is a statement"];');
    assert(results.succeeded() === false);
  });
});

describe("functions", () => {
  it("lets us declare a simple function", () => {
    results = r0b0p.match("PR0GRAM add_two[x, y] < G1V3 x + y; >");
    assert(results.succeeded());
  });
  it("lets us call a function", () => {
    results = r0b0p.match("SP3AK[add_two[5, 6]];");
    assert(results.succeeded());
  });
  it("does not let us declare a function without a space", () => {
    results = r0b0p.match("PR0GRAMadd_two[x, y] < G1V3 x + y; >");
    assert(results.succeeded() === false);
  });
  it("does not let us use a return statement without a space", () => {
    results = r0b0p.match("PR0GRAM add_two[x, y] < G1V3x + y; >");
    assert(results.succeeded() === false);
  });
});

describe("conditionals and loops", () => {
  it("lets us write a conditional statement", () => {
    results = r0b0p.match(
      "i = 3; PR3SUM1NG[i < 5] < z = 3 + 6; > 3LS3 1F[i > 7] < z = 1 + i; > 3LS3 < z = 4; >"
    );
    assert(results.succeeded());
  });
  it("does not let us use a statement as condition", () => {
    results = r0b0p.match(
      'PR3SUM1NG[SP3AK["This is a statement"]] < z = 3 + 6; >;'
    );
    assert(results.succeeded() === false);
  });
  it("does not let us use a statement as for-loop index", () => {
    results = r0b0p.match("C0UNT[i:0->SP3AK[10]] < SP3AK[i]; >");
    assert(results.succeeded() === false);
  });
  it("lets us call a for-loop", () => {
    results = r0b0p.match("C0UNT[i:0->10] < SP3AK[i]; >");
    assert(results.succeeded());
  });
  it("lets us call a while-loop", () => {
    results = r0b0p.match(
      'x = 0; WH1L3[x < 3] < SP3AK["Adding to x"]; x = x + 1; >'
    );
    assert(results.succeeded());
  });
});

describe("strings", () => {
  it("lets us create a string variable", () => {
    results = r0b0p.match('x = "hello, world!";');
    assert(results.succeeded());
  });
  it("does not let us create a string variable with single quotes", () => {
    results = r0b0p.match("y = 'hello, world!';");
    assert(results.succeeded() === false);
  });
  it("lets us concatenate strings", () => {
    results = r0b0p.match('x = "hello," + " world!";');
    assert(results.succeeded());
  });
  it("lets us perform string interpolation", () => {
    results = r0b0p.match("bananas = 3; SP3AK[\"I have 'bananas' bananas\"];");
    assert(results.succeeded());
    results = r0b0p.match(
      "quote = \"Hello, world!\"; SP3AK[\"She said \\''quote'\\'\"];"
    );
    assert(results.succeeded());
  });
});

describe("lists and dictionaries", () => {
  it("lets us create a dictionary variable", () => {
    results = r0b0p.match("x = {{a: 1, b: 2}};");
    assert(results.succeeded());
  });
  it("does not let us use a statement as dictionary value", () => {
    results = r0b0p.match("y = {{a: x = 3}};");
    assert(results.succeeded() === false);
  });
  it("lets us create a list variable", () => {
    results = r0b0p.match("x = {1, 2};");
    assert(results.succeeded());
  });
  it("does not let us have a statement in list", () => {
    results = r0b0p.match("y = {1, 2, 3, SP3AK[4]};");
    assert(results.succeeded() === false);
  });
});

describe("general things you can't do", () => {
  it("does not let us write nonsense without a comment", () => {
    results = r0b0p.match("xasldfadfsafsdafdsds");
    assert(results.succeeded() === false);
  });
  it("does not let us forget a semicolon", () => {
    results = r0b0p.match("x = {1, 2}");
    assert(results.succeeded() === false);
  });
  it("does not let us have mismatched brackets", () => {
    results = r0b0p.match("PR0GRAM add_two[x, y < G1V3 x + y; >");
    assert(results.succeeded() === false);
  });
  it("does not let us have mismatched < >", () => {
    results = r0b0p.match("PR0GRAM return_three[] < G1V3 3; ");
    assert(results.succeeded() === false);
  });
  it("does not let us use a N0T operator without a space", () => {
    results = r0b0p.match("x = 3; y = N0Tx;");
    assert(results.succeeded() === false);
  });
});

describe("some example programs", () => {
  it("lets you solve for pi", () => {
    results = r0b0p.match(`RADIUS = 1;

    PR0GRAM calculate_pi[num_darts] <
      num_darts_in_circle = throw_darts[num_darts];
      G1V3 (4 * (num_darts_in_circle / num_darts));
    >
    
    PR0GRAM throw_darts[num_darts] <
      circle_count = 0;
      C0UNT[darts_thrown:0->num_darts] <
        PR3SUM1NG[throw_dart[] < RADIUS] <
          circle_count = circle_count + 1;
        >
      >
      G1V3 circle_count;
    >
    
    PR0GRAM throw_dart[] <
      x = UNPR3D1CTABL3 * 2;
      y = UNPR3D1CTABL3 * 2;
      G1V3 calculate_distance_from_center[x, y];
    >
    
    PR0GRAM calculate_distance_from_center[x, y] <
      G1V3 SQRT[((x - RADIUS) ** 2) + ((y - RADIUS) ** 2)];
    >`);
    assert(results.succeeded());
  });
  it("lets you do the collatz sequence", () => {
    results = r0b0p.match(`PR0GRAM collatz_steps[n] <
    steps = 0;
    WH1L3[N0T (n == 1)] <
      PR3SUM1NG[n % 2 == 0] <
        n = n / 2;
      > 3LS3 <
        n = (3 * n) + 1;
      >
      steps = steps + 1;
    >
    G1V3 steps;
  >`);
    assert(results.succeeded());
  });
  it("lets you calculate powers", () => {
    results = r0b0p.match(`PR0GRAM powers[base, limit, callback] <
    current = 1;
    i = 1;
    WH1L3[current <= limit] <
      callback[current];
      current = base ** i;
      i = i + 1;
    >
    >`);
    assert(results.succeeded());
  });
  it("lets us do fizz buzz", () => {
    results = r0b0p.match(`C0UNT[i:1->21] <
    PR3SUM1NG[i % 15 == 0] <
        SP3AK["FizzBuzz"];
    > 3LS3 1F[i % 3 == 0] <
        SP3AK["Fizz"];
    > 3LS3 1F[i % 5 == 0] <
        SP3AK["Buzz"];
    > 3LS3 <
        SP3AK[i];
    >
    >`);
    assert(results.succeeded());
  });
  it("lets us see fibb sequence", () => {
    results = r0b0p.match(`PR0GRAM fibb[n] <
    PR3SUM1NG[n <= 2] <
      G1V3 1;
    > 3LS3 <
      G1V3 fibb[n - 1] + fibb[n - 2];
    >
    >`);
    assert(results.succeeded());
  });
  it("lets you calculate gcd", () => {
    results = r0b0p.match(`PR0GRAM gcd[a, b] <
    PR3SUM1NG[b == 0] <
      G1V3 a;
    >
    G1V3 gcd[b, (a % b)];
    >`);
    assert(results.succeeded());
  });
  it("lets us calculate the area of a circle", () => {
    results = r0b0p.match(`PR0GRAM area_of_circle[r] <
    G1V3 3.14159265 * r * r;
    >
    area = area_of_circle[10];`);
    assert(results.succeeded());
  });
});
