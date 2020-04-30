//the parser itself
const fs = require("fs");
const ohm = require("ohm-js");
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
  ElseBlock,
  ElseIfBlock,
  Print,
  List,
  Dict,
  KeyValue,
  Key,
  Text,
  Placeholder,
  BinaryExp,
  NegationExp,
  NotExp,
  IntLit,
  FloatLit,
  BoolLit,
  Undefined,
  Id,
} = require("../ast");

const grammar = ohm.grammar(
  fs.readFileSync(__dirname + "/../grammar/r0b0p.ohm")
);

// Ohm turns `x?` into either [x] or [], which we should clean up for our AST.
function arrayToNullable(a) {
  return a.length === 0 ? null : a[0];
}

/* eslint-disable no-unused-vars */
const astGenerator = grammar.createSemantics().addOperation("ast", {
  Program(statements) {
    return new Program(statements.ast());
  },
  Block(_lp, statements, _rp) {
    return new Block(statements.ast());
  },
  Assignment(id, _eq, exp) {
    return new Assignment(id.ast(), exp.ast());
  },
  Return(_give, exp) {
    return new Return(exp.ast());
  },
  FuncDecl(_program, name, _lb, params, _rb, block) {
    return new FuncDecl(name.ast(), arrayToNullable(params.ast()), block.ast());
  },
  WhileLoop(_while, _lb, condition, _rb, block) {
    return new WhileLoop(condition.ast(), block.ast());
  },
  ForLoop(_count, _lb, id, _colon, start, _arrow, end, _rb, block) {
    return new ForLoop(
      arrayToNullable(id.ast()),
      start.ast(),
      end.ast(),
      block.ast()
    );
  },
  break(_break) {
    return new Break();
  },
  continue(_continue) {
    return new Continue();
  },
  Conditional(_if, _lb, condition, _rb, block, elseIfBlock, elseBlock) {
    return new Conditional(
      condition.ast(),
      block.ast(),
      elseIfBlock.ast(),
      arrayToNullable(elseBlock.ast())
    );
  },
  ElseIfBlock(_elseIf, _lb, exp, _rb, block) {
    return new ElseIfBlock(exp.ast(), block.ast());
  },
  ElseBlock(_else, block) {
    return new ElseBlock(block.ast());
  },
  FuncCall(id, _lb, params, _rb) {
    return new FuncCall(id.ast(), arrayToNullable(params.ast()));
  },
  Print(_speak, _lb, exp, _rb) {
    return new Print(exp.ast());
  },
  List(_lcb, items, _rcb) {
    return new List(arrayToNullable(items.ast()));
  },
  Dict(_lcb, items, _rcb) {
    return new Dict(arrayToNullable(items.ast()));
  },
  KeyValue(id, _colon, exp) {
    return new KeyValue(id.ast(), exp.ast());
  },
  Key(name) {
    return new Key(name.ast());
  },
  Text(_lq, chars, _rq) {
    let quasi = "";
    let placeholders = [];
    for (let i = 0; i < chars.ast().length; i++) {
      const value = chars.ast()[i];
      if (value.constructor === Placeholder) {
        value.index = i - placeholders.length;
        placeholders.push(value);
      } else {
        quasi += value;
      }
    }
    return new Text(quasi, placeholders);
  },
  Placeholder(_lApos, exp, _rApos) {
    return new Placeholder(exp.ast());
  },
  quasi(_value) {
    return this.sourceString;
  },
  Exp_binary(left, op, right) {
    return new BinaryExp(op.ast(), left.ast(), right.ast());
  },
  Exp1_binary(left, op, right) {
    return new BinaryExp(op.ast(), left.ast(), right.ast());
  },
  Exp2_binary(left, op, right) {
    return new BinaryExp(op.ast(), left.ast(), right.ast());
  },
  Exp3_binary(left, op, right) {
    return new BinaryExp(op.ast(), left.ast(), right.ast());
  },
  Exp4_negation(_neg, operand) {
    return new NegationExp(operand.ast());
  },
  Exp5_binary(left, op, right) {
    return new BinaryExp(op.ast(), left.ast(), right.ast());
  },
  Exp6_not(_not, exp) {
    return new NotExp(exp.ast());
  },
  Exp7_parens(_lp, exp, _rp) {
    return exp.ast();
  },
  Statement_simple(statement, _semicolon) {
    return statement.ast();
  },
  SimpStmt_call(func) {
    return new FuncCallStmt(func.ast());
  },
  Id(value) {
    return new Id(value.ast());
  },
  id(_firstChar, _restChars) {
    return this.sourceString;
  },
  number_integer(digits) {
    return new IntLit(+this.sourceString);
  },
  decimal(_whole, _decimal, _fractional) {
    return new FloatLit(+this.sourceString);
  },
  boolean(_value) {
    return new BoolLit(this.sourceString);
  },
  _terminal() {
    return this.sourceString;
  },
  NonemptyListOf(first, _separator, rest) {
    return [first.ast(), ...rest.ast()];
  },
  EmptyListOf() {
    return [];
  },
  undefined(_value) {
    return new Undefined();
  },
});
/* eslint-enable no-unused-vars */

module.exports = (text) => {
  const match = grammar.match(text);
  if (!match.succeeded()) {
    throw new Error(`Syntax Error: ${match.message}`);
  }
  return astGenerator(match).ast();
};
