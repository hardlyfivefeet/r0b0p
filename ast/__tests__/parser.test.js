/*
 * Parser Tests
 *
 * These tests check that the parser produces the AST that we expect.
 *
 * Note we are only checking syntactic forms here, so our test programs
 * may have semantic errors.
 */

const parse = require("../parser");

//In order to silence our warnings in the test files, so that we don't have to "use" all
//of the test variables and ruin the integrity of the tests, we redefine console.warn.
console.warn = function () { }

const {
  Program,
  Block,
  Assignment,
  Return,
  FuncDecl,
  FuncCall,
  FuncCallStmt,
  WhileLoop,
  ForLoop,
  Break,
  Continue,
  Conditional,
  ElseIfBlock,
  ElseBlock,
  Print,
  List,
  Dict,
  KeyValue,
  Key,
  BinaryExp,
  NegationExp,
  NotExp,
  Text,
  Placeholder,
  IntLit,
  FloatLit,
  BoolLit,
  Undefined,
  Id,
} = require("../../ast");

const fixture = {
  hello: [
    String.raw`SP3AK["Hello, world"];`,
    new Program([new Print(new Text("Hello, world"))]),
  ],
  conditional: [
    String.raw`PR3SUM1NG[x < 5] < >`,
    new Program([
      new Conditional(
        new BinaryExp("<", new Id("x"), new IntLit(5)),
        new Block([]),
        [],
        null
      ),
    ]),
  ],
  conditionalWithContent: [
    String.raw`PR3SUM1NG[x < 5] < x = 62; >`,
    new Program([
      new Conditional(
        new BinaryExp("<", new Id("x"), new IntLit(5)),
        new Block([new Assignment(new Id("x"), new IntLit("62"))]),
        [],
        null
      ),
    ]),
  ],
  conditionalWithElseIf: [
    String.raw`PR3SUM1NG[x < 5] < x = 62; > 3LS3 1F[x < 20] < x = 96; >`,
    new Program([
      new Conditional(
        new BinaryExp("<", new Id("x"), new IntLit(5)),
        new Block([new Assignment(new Id("x"), new IntLit("62"))]),
        [
          new ElseIfBlock(
            new BinaryExp("<", new Id("x"), new IntLit("20")),
            new Block([new Assignment(new Id("x"), new IntLit("96"))])
          ),
        ],
        null
      ),
    ]),
  ],
  conditionalWithElseIfAndElse: [
    String.raw`PR3SUM1NG[x < 5] < x = 62; > 3LS3 1F[x < 20] < x = 96; > 3LS3 < x = 100; >`,
    new Program([
      new Conditional(
        new BinaryExp("<", new Id("x"), new IntLit(5)),
        new Block([new Assignment(new Id("x"), new IntLit("62"))]),
        [
          new ElseIfBlock(
            new BinaryExp("<", new Id("x"), new IntLit("20")),
            new Block([new Assignment(new Id("x"), new IntLit("96"))])
          ),
        ],
        new ElseBlock(
          new Block([new Assignment(new Id("x"), new IntLit("100"))])
        )
      ),
    ]),
  ],
  while: [
    String.raw`WH1L3[y > 20] < >`,
    new Program([
      new WhileLoop(
        new BinaryExp(">", new Id("y"), new IntLit(20)),
        new Block([])
      ),
    ]),
  ],
  forLoop: [
    String.raw`x_is_even = b0p; C0UNT[x:0->5] < x_is_even = N0T x_is_even; >`,
    new Program([
      new Assignment(new Id("x_is_even"), new BoolLit("b0p")),
      new ForLoop(
        new Id("x"),
        new IntLit(0),
        new IntLit("5"),
        new Block([
          new Assignment(new Id("x_is_even"), new NotExp(new Id("x_is_even"))),
        ])
      ),
    ]),
  ],
  whileWithContent: [
    String.raw`WH1L3[y > 20] < y = y - 1; >`,
    new Program([
      new WhileLoop(
        new BinaryExp(">", new Id("y"), new IntLit(20)),
        new Block([
          new Assignment(
            new Id("y"),
            new BinaryExp("-", new Id("y"), new IntLit(1))
          ),
        ])
      ),
    ]),
  ],
  whileWithBreak: [
    String.raw`WH1L3[y > 20] < PR3SUM1NG[y == 13] < D1SC0NT1NU3; > >`,
    new Program([
      new WhileLoop(
        new BinaryExp(">", new Id("y"), new IntLit(20)),
        new Block([
          new Conditional(
            new BinaryExp("==", new Id("y"), new IntLit(13)),
            new Block([new Break()]),
            [],
            null
          ),
        ])
      ),
    ]),
  ],
  forWithContinue: [
    String.raw`x_is_even = b0p; C0UNT[x:0->5] < PR3SUM1NG[x == 3] < C0NT1NU3; > x_is_even = N0T x_is_even; >`,
    new Program([
      new Assignment(new Id("x_is_even"), new BoolLit("b0p")),
      new ForLoop(
        new Id("x"),
        new IntLit(0),
        new IntLit("5"),
        new Block([
          new Conditional(
            new BinaryExp("==", new Id("x"), new IntLit(3)),
            new Block([new Continue()]),
            [],
            null
          ),
          new Assignment(new Id("x_is_even"), new NotExp(new Id("x_is_even"))),
        ])
      ),
    ]),
  ],
  binaryExpWithAndOrOp: [
    String.raw`b = y == 3 && (x == 5 || z == 6);`,
    new Program([
      new Assignment(
        new Id("b"),
        new BinaryExp(
          "&&",
          new BinaryExp("==", new Id("y"), new IntLit(3)),
          new BinaryExp(
            "||",
            new BinaryExp("==", new Id("x"), new IntLit(5)),
            new BinaryExp("==", new Id("z"), new IntLit(6))
          )
        )
      ),
    ]),
  ],
  mathExp: [
    String.raw`z = (-16.4 * 32) ** 8;`,
    new Program([
      new Assignment(
        new Id("z"),
        new BinaryExp(
          "**",
          new BinaryExp(
            "*",
            new NegationExp(new FloatLit("16.4")),
            new IntLit("32")
          ),
          new IntLit("8")
        )
      ),
    ]),
  ],
  funcDecl: [
    String.raw`PR0GRAM add_five[value] < G1V3 value + 5; >`,
    new Program([
      new FuncDecl(
        new Id("add_five"),
        [new Id("value")],
        new Block([
          new Return(new BinaryExp("+", new Id("value"), new IntLit("5"))),
        ])
      ),
    ]),
  ],
  funcDeclNoParams: [
    String.raw`PR0GRAM give_five[] < G1V3 5; >`,
    new Program([
      new FuncDecl(
        new Id("give_five"),
        [],
        new Block([new Return(new IntLit("5"))])
      ),
    ]),
  ],
  funcCallStmt: [
    String.raw`show_print["hi"];`,
    new Program([
      new FuncCallStmt(new FuncCall(new Id("show_print"), [new Text("hi")])),
    ]),
  ],
  Stmt: [
    String.raw`y = add_five[26];`,
    new Program([
      new Assignment(
        new Id("y"),
        new FuncCall(new Id("add_five"), [new IntLit("26")])
      ),
    ]),
  ],
  list: [
    String.raw`x = {1, 2, 3, 4};`,
    new Program([
      new Assignment(
        new Id("x"),
        new List([
          new IntLit("1"),
          new IntLit("2"),
          new IntLit("3"),
          new IntLit("4"),
        ])
      ),
    ]),
  ],
  dict: [
    String.raw`y = {a: 1, b: 2};`,
    new Program([
      new Assignment(
        new Id("y"),
        new Dict([
          new KeyValue(new Key("a"), new IntLit(1)),
          new KeyValue(new Key("b"), new IntLit(2)),
        ])
      ),
    ]),
  ],
  listSubstitute: [
    String.raw`SUBST1TUT3[{1, 2, 3, 4}, 0, 50];`,
    new Program([
      new FuncCallStmt(
        new FuncCall("SUBST1TUT3", [
          new List([
            new IntLit("1"),
            new IntLit("2"),
            new IntLit("3"),
            new IntLit("4"),
          ]),
          new IntLit(0),
          new IntLit(50),
        ])
      ),
    ]),
  ],
  listSize: [
    String.raw`S1Z3[{3, 4, 5, 6}];`,
    new Program([
      new FuncCallStmt(
        new FuncCall("S1Z3", [
          new List([
            new IntLit("3"),
            new IntLit("4"),
            new IntLit("5"),
            new IntLit("6"),
          ]),
        ])
      ),
    ]),
  ],
  listRetrieve: [
    String.raw`R3TR13V3_AT[{7, 7, 7, 7}, 0];`,
    new Program([
      new FuncCallStmt(
        new FuncCall("R3TR13V3_AT", [
          new List([
            new IntLit("7"),
            new IntLit("7"),
            new IntLit("7"),
            new IntLit("7"),
          ]),
          new IntLit(0),
        ])
      ),
    ]),
  ],
  listDiscard: [
    String.raw`D1SCARD_AT[{7, 7, 7, 7}, 3];`,
    new Program([
      new FuncCallStmt(
        new FuncCall("D1SCARD_AT", [
          new List([
            new IntLit("7"),
            new IntLit("7"),
            new IntLit("7"),
            new IntLit("7"),
          ]),
          new IntLit(3),
        ])
      ),
    ]),
  ],
  listPlace: [
    String.raw`PLAC3_AT[{7, 7, 7, 7}, 3, 2];`,
    new Program([
      new FuncCallStmt(
        new FuncCall("PLAC3_AT", [
          new List([
            new IntLit("7"),
            new IntLit("7"),
            new IntLit("7"),
            new IntLit("7"),
          ]),
          new IntLit(3),
          new IntLit(2),
        ])
      ),
    ]),
  ],
  dictSubstitute: [
    String.raw`SUBST1TUT3[{a: 1, b: 2}, "a", 50];`,
    new Program([
      new FuncCallStmt(
        new FuncCall("SUBST1TUT3", [
          new Dict([
            new KeyValue(new Key("a"), new IntLit(1)),
            new KeyValue(new Key("b"), new IntLit(2)),
          ]),
          new Text("a", []),
          new IntLit(50),
        ])
      ),
    ]),
  ],
  dictCodes: [
    String.raw`C0D3S[{a: 1, b: 2}];`,
    new Program([
      new FuncCallStmt(
        new FuncCall("C0D3S", [
          new Dict([
            new KeyValue(new Key("a"), new IntLit(1)),
            new KeyValue(new Key("b"), new IntLit(2)),
          ]),
        ])
      ),
    ]),
  ],
  dictRetrieve: [
    String.raw`R3TR13V3[{hi: "a", hello: "b"}, "hello"];`,
    new Program([
      new FuncCallStmt(
        new FuncCall("R3TR13V3", [
          new Dict([
            new KeyValue(new Key("hi"), new Text("a")),
            new KeyValue(new Key("hello"), new Text("b")),
          ]),
          new Text("hello"),
        ])
      ),
    ]),
  ],
  dictDiscard: [
    String.raw`D1SCARD[{a: "b", c: "d", e: "f"}, "a"];`,
    new Program([
      new FuncCallStmt(
        new FuncCall("D1SCARD", [
          new Dict([
            new KeyValue(new Key("a"), new Text("b")),
            new KeyValue(new Key("c"), new Text("d")),
            new KeyValue(new Key("e"), new Text("f")),
          ]),
          new Text("a"),
        ])
      ),
    ]),
  ],
  dictPlace: [
    String.raw`PLAC3[{a: 1, b: 2}, "a", 3];`,
    new Program([
      new FuncCallStmt(
        new FuncCall("PLAC3", [
          new Dict([
            new KeyValue(new Key("a"), new IntLit(1)),
            new KeyValue(new Key("b"), new IntLit(2)),
          ]),
          new Text("a"),
          new IntLit(3),
        ])
      ),
    ]),
  ],
  stringInterpolation: [
    String.raw`bananas = 3; SP3AK["She has 'bananas' bananas."];`,
    new Program([
      new Assignment(new Id("bananas"), new IntLit("3")),
      new Print(
        new Text("She has  bananas.", [new Placeholder(new Id("bananas"), 8)])
      ),
    ]),
  ],
  stringInterpolationWithEscapes: [
    String.raw`quote = "Hi there"; SP3AK["She said \''quote'\'."];`,
    new Program([
      new Assignment(new Id("quote"), new Text("Hi there")),
      new Print(
        new Text(`She said \\'\\'.`, [new Placeholder(new Id("quote"), 10)])
      ),
    ]),
  ],
  escapeSequences: [
    String.raw`quote = "\\";`,
    new Program([new Assignment(new Id("quote"), new Text("\\\\"))]),
  ],
  undefined: [
    String.raw`x = uncl3ar; SP3AK[x];`,
    new Program([
      new Assignment(new Id("x"), new Undefined()),
      new Print(new Id("x")),
    ]),
  ],
};

describe("The parser", () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct AST for ${name}`, (done) => {
      expect(parse(source)).toEqual(expected);
      done();
    });
  });

  test("throws an exception on a syntax error", (done) => {
    expect(() => parse("as$df^&%*$&")).toThrow();
    done();
  });
});
