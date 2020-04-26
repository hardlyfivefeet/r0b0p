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

  assign: [
    String.raw`x = 5 * -2 + 8 % 2 / 3 ** 2;`,
    String.raw`let x = 5 * (-2) + 8 % 2 / 3 ** 2;`,
  ],

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

  forLoopWithId: [
    String.raw`C0UNT[i:0->10] < SP3AK[i]; >`,
    String.raw`for (let i = 0; i < 10; i++) { console.log(i); }`,
  ],

  forLoopWithoutId: [
    String.raw`C0UNT[0->10] < SP3AK["hi there"]; >`,
    String.raw`for (let i = 0; i < 10; i++) { console.log("hi there"); }`,
  ],

  if: [
    String.raw`x = 2; PR3SUM1NG[x == 2] < SP3AK["X is two."]; >`,
    String.raw`let x = 2; if (x === 2) { console.log("X is two."); }`,
  ],

  ifElse: [
    String.raw`x = 2; PR3SUM1NG[x == 2] < SP3AK["X is two."]; > 3LS3 < SP3AK["X is not two."]; >`,
    String.raw`let x = 2; if (x === 2) { console.log("X is two."); } else { console.log("X is not two."); }`,
  ],

  ifElseIfElse: [
    String.raw`x = 2; PR3SUM1NG[x == 2] < SP3AK["X is two."]; > 3LS3 1F[x == 3] < SP3AK["X is three."]; > 3LS3 < SP3AK["X is not two."]; >`,
    String.raw`let x = 2; if (x === 2) { console.log("X is two."); } else if(x === 3) { console.log("X is three."); } else { console.log("X is not two."); }`,
  ],

  function: [
    String.raw`PR0GRAM add[x, y] < G1V3 x + y; > z = add[5, 4];`,
    String.raw`function add(x, y) { return x + y; } let z = add(5, 4);;`,
  ],

  breakAndContinue: [
    String.raw`x = 5; WH1L3[x == 5] < PR3SUM1NG[x == 5] < D1SC0NT1NU3; > 3LS3 < x = x + 1; C0NT1NU3; > >`,
    String.raw`let x = 5; while(x === 5) { if(x === 5) { break; } else { let x = x + 1; continue;} }`,
  ],

  trueAndFalse: [
    String.raw`x = b1p; y = b0p;`,
    String.raw`let x = true; let y = false;`,
  ],

  interpolation: [
    String.raw`bananas = 3; x = "I have 'bananas' bananas"; SP3AK[x];`,
    'let bananas = 3; let x = "I have ${' +
      "bananas" +
      '} bananas"; console.log(x);',
  ],

  undefined: [
    String.raw`x = uncl3ar; SP3AK[x];`,
    String.raw`let x = null; console.log(x);`,
  ],

  notexp: [
    String.raw`x = N0T b1p; SP3AK[x];`,
    String.raw`let x = !true; console.log(x);`,
  ],
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
