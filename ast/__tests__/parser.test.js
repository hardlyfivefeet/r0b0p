/*
 * Parser Tests
 *
 * These tests check that the parser produces the AST that we expect.
 *
 * Note we are only checking syntactic forms here, so our test programs
 * may have semantic errors.
 */

const parse = require("../parser");

const {
  Block,
  Assignment,
  Return,
  FuncDecl,
  WhileLoop,
  ForLoop,
  Conditional,
  ElseIfBlock,
  ElseBlock,
  FuncCall,
  Print,
  List,
  Dict,
  BinaryExp,
  NegationExp,
  ParensExp,
  NotExp,
  SimpleStatement
} = require("../../ast");

const fixture = {
  // hello: [
  //   String.raw`SP3AK["Hello, world"];`,
  //   new SimpleStatement('SP3AK["Hello, world"]', ";")
  // ],
  conditional: [
    String.raw`PR3SUM1NG[x < 5] < >`,
    new Conditional(new BinaryExp("<", "x", "5"), 
                    new Block(),
                    new ElseIfBlock(new BinaryExp(), new Block()),
                    new ElseBlock(new Block()))
  ]
};

describe("The parser", () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct AST for ${name}`, done => {
      expect(parse(source)).toEqual(expected);
      done();
    });
  });

  test("throws an exception on a syntax error", done => {
    expect(() => parse("as$df^&%*$&")).toThrow();
    done();
  });
});
