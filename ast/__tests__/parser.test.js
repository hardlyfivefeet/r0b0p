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
  Text,
  IntLit,
  FloatLit
} = require("../../ast");

const fixture = {
  hello: [
    String.raw`SP3AK["Hello, world"];`,
    [new Print(new Text("Hello, world"))]
  ],
  conditional: [
    String.raw`PR3SUM1NG[x < 5] < >`,
    [
      new Conditional(
        new BinaryExp("<", "x", new IntLit(5)),
        new Block([]),
        [],
        null
      )
    ]
  ],
  conditionalWithContent: [
    String.raw`PR3SUM1NG[x < 5] < x = 62; >`,
    [
      new Conditional(
        new BinaryExp("<", "x", new IntLit(5)),
        new Block([new Assignment("x", new IntLit("62"))]),
        [],
        null
      )
    ]
  ],
  conditionalWithElseIf: [
    String.raw`PR3SUM1NG[x < 5] < x = 62; > 3LS3 1F[x < 20] < x = 96; >`,
    [
      new Conditional(
        new BinaryExp("<", "x", new IntLit(5)),
        new Block([new Assignment("x", new IntLit("62"))]),
        [
          new ElseIfBlock(
            new BinaryExp("<", "x", new IntLit("20")),
            new Block([new Assignment("x", new IntLit("96"))])
          )
        ],
        null
      )
    ]
  ],
  conditionalWithElseIfAndElse: [
    String.raw`PR3SUM1NG[x < 5] < x = 62; > 3LS3 1F[x < 20] < x = 96; > 3LS3 < x = 100; >`,
    [
      new Conditional(
        new BinaryExp("<", "x", new IntLit(5)),
        new Block([new Assignment("x", new IntLit("62"))]),
        [
          new ElseIfBlock(
            new BinaryExp("<", "x", new IntLit("20")),
            new Block([new Assignment("x", new IntLit("96"))])
          )
        ],
        new ElseBlock(new Block([new Assignment("x", new IntLit("100"))]))
      )
    ]
  ],
  while: [
    String.raw`WH1L3[y > 20] < >`,
    [new WhileLoop(new BinaryExp(">", "y", new IntLit(20)), new Block([]))]
  ],
  whileWithContent: [
    String.raw`WH1L3[y > 20] < y = y - 1; >`,
    [
      new WhileLoop(
        new BinaryExp(">", "y", new IntLit(20)),
        new Block([new Assignment("y", new BinaryExp("-", "y", new IntLit(1)))])
      )
    ]
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
