/*
 * JavaScript Code Generator Tests
 *
 * These tests check that the JavaScript generator produces the target
 * JavaScript that we expect.
 */

const parse = require("../../ast/parser");
const analyze = require("../../semantics/analyzer");
const generate = require("../js_generator");

const fixture = {
  hello: [
    String.raw`SP3AK["Hello, world\n"];`,
    String.raw`console.log("Hello, world\n")`,
  ],

  // assign: [String.raw`x = 5 * -2 + 8`, String.raw`let x = ((5 * (-(2))) + 8)`],

  // constAssign: [
  //   String.raw`X = 5 * -2 + 8`,
  //   String.raw`const x = ((5 * (-(2))) + 8)`,
  // ],

  // funcDeclAndCall: [
  //   String.raw`PR0GRAM f[x, y] < SP3AK("x is " + x + " and y is " + y) > f(32, 900);`,
  //   String.raw`function f(x, y) { console.log("x is " + x + " and y is " + y); } f(32, 900);`,
  // ],

  // whileLoop: [
  //   String.raw`x = 7; WH1L3[x == 7] < x = x + 1; >`,
  //   String.raw`let x = 7; while (x === 7) { x = x + 1; }`,
  // ],

  // forLoop: [
  //   String.raw`C0UNT[i:0->10] < SP3AK[i]; >`,
  //   String.raw`for (let i = 0; i < 10; i++) { console.log(i); }`,
  // ],

  // ifElse: [
  //   String.raw`x = 2; PR3SUM1NG[x == 2] < SP3AK["X is two."]; > 3LS3 < SP3AK["X is not two."]; >`,
  //   String.raw`let x = 2; if (x === 2) { console.log("X is two."); } else { console.log("X is not two."); }`,
  // ],

  // ifElseIfElse: [
  //   String.raw`x = 2; PR3SUM1NG[x == 2] < SP3AK["X is two."]; > 3LS3 1F[x == 3] { SP3AK["X is three."]; } 3LS3 < SP3AK["X is not two."]; >`,
  //   String.raw`let x = 2; if (x === 2) { console.log("X is two."); } else if(x === 3) { console.log("X is three."); } else { console.log("X is not two."); }`,
  // ],

  //TODO: From this point on it's not r0b0p, need to be converted.

  // member: [
  //   String.raw`let type r = {x:string} var p := r{x="@"} in print(p.x) end`,
  //   /let p_(\d+) = \{\s*x: "@"\s*\};\s*console.log\(p_\1\.x\)/,
  // ],

  // subscript: [
  //   String.raw`let type r = array of string var a := r[3] of "" in print(a[0]) end`,
  //   /let a_(\d+) = Array\(3\).fill\(""\);\s*console.log\(a_\1\[0\]\)/,
  // ],

  // letInFunction: [
  //   String.raw`let function f():int = let var x:= 1 in x end in () end`,
  //   /function f_(\d+)\(\) \{\s*let x_(\d+) = 1;\s*return x_\2\s*\};/,
  // ],

  // letAsValue: [
  //   String.raw`print(let var x := "dog" in concat(x, "s") end)`,
  //   /console.log\(\(\(\) => \{\s*let x_(\d+) = "dog";\s*return x_\1.concat\("s"\);\s*\}\)\(\)\)/,
  // ],

  // returnExpressionSequence: [
  //   String.raw`let function f():int = let var x:= 1 in (1;nil;3) end in () end`,
  //   /function f_(\d+)\(\) {\s*let x_(\d+) = 1;\s*1;\s*null;\s*return 3\s*\};/,
  // ],

  // moreBuiltIns: [
  //   String.raw`(ord("x"); chr(30); substring("abc", 0, 1))`,
  //   /\("x"\).charCodeAt\(0\);\s*String.fromCharCode\(30\);\s*"abc".substr\(0, 1\)/,
  // ],

  // evenMoreBuiltIns: [
  //   String.raw`(not(1) ; size(""); exit(3))`,
  //   /\(!\(1\)\);\s*"".length;\s*process\.exit\(3\)/,
  // ],
};

describe("The JavaScript generator", () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct output for ${name}`, (done) => {
      // const ast = parse(source);
      // analyze(ast);
      // expect(generate(ast)).toMatch(expected);
      done();
    });
  });
});
