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

describe("types", () => {
  it("lets us check if something is unclear/undefined", () => {
    results = r0b0p.match("PR3SUM1NG[x == uncl3ar] { SP3AK[5]; }");
    assert(results.succeeded());
  });
});

describe("comments", () => {
  it("lets us write nonsense in a comment", () => {
    results = r0b0p.match("...asldweroipuqwerpou\n");
    assert(results.succeeded());
  });
});

describe("math", () => {
  it("lets us use operations such as +, -, *, /", () => {
    results = r0b0p.match("y = (5 * 9 / (54 % 10 + 33) - 1);");
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
    results = r0b0p.match(
      "i = 3; PR3SUM1NG[i < 5] { z = 3 + 6; } 3LS3 1F[i > 7] { z = 1 + i; } 3LS3 { z = 4; }"
    );
    assert(results.succeeded());
  });
  it("lets us call a for-loop", () => {
    results = r0b0p.match("C0UNT[i:0->10] { SP3AK[i]; }");
    assert(results.succeeded());
  });
  it("lets us call a while-loop", () => {
    results = r0b0p.match(
      'x = 0; WH1L3[x < 3] { SP3AK["Adding to x"]; x = x + 1; }'
    );
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

describe("things you can't do", () => {
  it("does not let us write nonsense without a comment", () => {
    results = r0b0p.match("xasldfadfsafsdafdsds");
    assert(results.succeeded() === false);
  });
  it("does not let us forget a semicolon", () => {
    results = r0b0p.match("x = {1, 2}");
    assert(results.succeeded() === false);
  });
  it("does not let us forget a closing brace", () => {
    results = r0b0p.match("PR0GRAM addTwo[x, y { G1V3 x + y; }");
    assert(results.succeeded() === false);
  });
});

describe("some example programs", () => {
  it("lets you solve for pi", () => {
    results = r0b0p.match(`RADIUS = 1;

    PR0GRAM calculate_pi[num_darts] {
      num_darts_in_circle = throw_darts[num_darts];
      G1V3 (4 * (num_darts_in_circle / num_darts));
    }
    
    PR0GRAM throwDarts[num_darts] {
      circle_count = 0;
      C0UNT[darts_thrown:0->num_darts] {
        PR3SUM1NG[throw_dart[] < RADIUS] {
          circle_count = circle_count + 1;
        }
      }
      G1V3 circle_count;
    }
    
    PR0GRAM throw_dart[] {
      x = UNPR3D1CTABL3 * 2;
      y = UNPR3D1CTABL3 * 2;
      G1V3 calculate_distance_from_center[x, y];
    }
    
    PR0GRAM calculate_distance_from_center[x, y] {
      G1V3 SQRT[((x - RADIUS) ** 2) + ((y - RADIUS) ** 2)];
    }`);
    assert(results.succeeded());
  });
  it("lets you do the collatz sequence", () => {
    results = r0b0p.match(`PR0GRAM collatzSteps[n] {
      steps = 0;
      WH1L3[N0T (n == 1)] {
        PR3SUM1NG[n % 2 == 0] {
          n = n / 2;
        } 3LS3 {
          n = (3 * n) + 1;
        }
        steps = steps + 1;
      }
      G1V3 steps;
    }`);
    assert(results.succeeded());
  });
});
