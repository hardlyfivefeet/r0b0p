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
  mathBuiltins: [
    String.raw`x = SQRT[49]; x = ABS[-10]; x = FL00R[10.9]; x = CE1L[10.9]; x = R0UND[0.5]; x = UNPR3D1CTABL3[];`,
    String.raw`let x = Math.sqrt(49); let x = Math.abs((-10)); let x = Math.floor(10.9); let x = Math.ceil(10.9); let x = Math.round(0.5); let x = Math.random();`,
  ],

  listBuiltins: [
    String.raw`list = {1, 2, 3, 4}; SUBST1TUT3[list, 0, 100]; PLAC3_AT[list, 2, 5]; D1SCARD_AT[list, 3]; value = R3TR13V3_AT[list, 0]; list_length = S1Z3[list];`,
    String.raw`let list = [1, 2, 3, 4]; list[0] = 100; list.splice(2, 0, 5); list.splice(3, 1); let value = list[0]; let list_length = list.length;`,
  ],

  dictBuiltins: [
    String.raw`dict = {a: 2, b: 3}; PLAC3[dict, "c", 3]; D1SCARD[dict, "a"]; value = R3TR13V3[dict, "c"]; keys = C0D3S[dict];`,
    String.raw`let dict = {a: 2, b: 3}; dict["c"] = 3; delete dict["a"]; let value = dict["c"]; let keys = Object.keys(dict);`,
  ],

  stringBuiltins: [
    String.raw`s = "test string"; strlen = S1Z3[s]; has_substr = C0NTA1NS[s, "test"]; new_str = SUBT3XT[s, 0, 10]; s_array = SPL1T[s, ""]; new_str = MAK3_UPP3R[s]; new_str = MAK3_LOW3R[s];`,
    String.raw`let s = "test string"; let strlen = s.length; let has_substr = s.includes("test"); let new_str = s.substring(0, 10); let s_array = s.split(""); let new_str = s.toUpperCase(); let new_str = s.toLowerCase();`,
  ],

  maxAndMinArray: [
    String.raw`max = MAX1MUM[{1, 2, 3}]; min = M1N1MUM[{1, 2, 3}];`,
    String.raw`let max = Math.max([1, 2, 3]); let min = Math.min([1, 2, 3]);`,
  ],

  hello: [
    String.raw`SP3AK["Hello, world\n"];`,
    String.raw`console.log("Hello, world\n");`,
  ],

  assign: [String.raw`x = 5 * -2 + 8;`, String.raw`let x = 5 * (-2) + 8;`],

  constAssign: [
    String.raw`X = 5 * -2 + 8;`,
    String.raw`const X = 5 * (-2) + 8;`,
  ],

  funcDeclAndCall: [
    String.raw`PR0GRAM f[x, y] < SP3AK["x is " + x + " and y is " + y]; > f[32, 900];`,
    String.raw`function f(x, y) { console.log("x is " + x + " and y is " + y); } f(32, 900);`,
  ],

  whileLoop: [
    String.raw`x = 7; WH1L3[x == 7] < x = x + 1; >`,
    String.raw`let x = 7; while (x === 7) { let x = x + 1; }`,
  ],

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

function normalize(str) {
  return str.replace(/\s+/g, "").replace(/_\d+/g, "");
}

describe("The JavaScript generator", () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct output for ${name}`, (done) => {
      const ast = parse(source);
      analyze(ast);
      expect(normalize(generate(ast))).toEqual(normalize(expected));
      done();
    });
  });
});
