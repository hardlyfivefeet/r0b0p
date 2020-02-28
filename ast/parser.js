//the parser itself
const fs = require("fs");
const ohm = require("ohm-js");
const {
  Block,
  Assignment,
  Return,
  FuncDecl,
  WhileLoop,
  ForLoop,
  Conditional,
  FuncCall,
  Print,
  List,
  Dict,
  BinaryExp,
  NegationExp,
  ParensExp,
  NotExp,
  SimpleStatement
} = require("../ast");

const grammar = ohm.grammar(fs.readFileSync(__dirname + "/../r0b0p.ohm"));

// Ohm turns `x?` into either [x] or [], which we should clean up for our AST.
function arrayToNullable(a) {
  return a.length === 0 ? null : a[0];
}

/* eslint-disable no-unused-vars */
const astGenerator = grammar.createSemantics().addOperation("ast", {
  Block(_lp, statements, _rp) {
    return new Block(statements.ast());
  },
  Assignment(id, _eq, exp) {
    return new Assignment(id.ast(), exp.ast());
  },
  Return(_give, exp) {
    return new Return(exp.ast());
  },
  FuncDecl(_program, name, _lb, params, _rb, _lcb, statements, _rcb) {
    return new FuncDecl(name.ast(), params.ast(), statements.ast());
  },
  WhileLoop(_while, _lb, condition, _rb, block) {
    return new WhileLoop(condition.ast(), block.ast());
  },
  ForLoop(_count, _lb, id, start, _arrow, end, _rb, block) {
    return new ForLoop(id.ast(), start.ast(), end.ast(), block.ast());
  },
  Conditional(_if, _lb, condition, _rb, block, elseIfBlock, elseBlock) {
    return new Conditional(
      condition.ast(),
      block.ast(),
      elseIfBlock.ast(),
      elseBlock.ast()
    );
  },
  FuncCall(name, _lb, params, _rb) {
    return new FuncCall(name.ast(), params.ast());
  },
  Print(_speak, _lb, exp, _rb) {
    return new Print(exp.ast());
  },
  List(_lcb, items, _rcb) {
    return new List(items.ast());
  },
  Dict(_lcb, items, _rcb) {
    return new Dict(items.ast());
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
  Exp5_binary(left, op, right) {
    return new BinaryExp(op.ast(), right.ast(), left.ast());
  },
  Exp4_negation(_neg, operand) {
    return new NegationExp(operand.ast());
  },
  Exp7_parens(_lp, exp, _rp) {
    return new ParensExp(exp.ast());
  },
  Exp6_not(_not, exp) {
    return new NotExp(exp.ast());
  },
  Statement_simple(statement, _semicolon) {
    return new SimpleStatement(statement.ast());
  }
});
/* eslint-enable no-unused-vars */

module.exports = text => {
  const match = grammar.match(text);
  if (!match.succeeded()) {
    throw new Error(`Syntax Error: ${match.message}`);
  }
  return astGenerator(match).ast();
};
