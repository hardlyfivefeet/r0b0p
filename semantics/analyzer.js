// The semantic analyzer

const {
  Program,
  Block,
  Assignment,
  Return,
  FuncDecl,
  WhileLoop,
  ForLoop,
  Conditional,
  ElseBlock,
  ElseIfBlock,
  FuncCall,
  Print,
  List,
  Dict,
  KeyValue,
  BinaryExp,
  NegationExp,
  ParensExp,
  NotExp,
  IntLit,
  FloatLit,
  Text,
  Id,
} = require("../ast");
const check = require("./check");
const Context = require("./context");

module.exports = function (exp) {
  exp.analyze(Context.INITIAL);
};

Assignment.prototype.analyze = function (context) {
  this.exp.analyze(context);
  let initialized = true;
  try {
    context.lookup(this.id.ref);
  } catch (err) {
    initialized = false;
  }
  if (initialized) {
    check.isNotReadOnly(this.id.ref);
  }
  context.add(this.id.ref, this.exp);
};

BinaryExp.prototype.analyze = function (context) {
  this.left.analyze(context);
  this.right.analyze(context);
  if (/\/|\*|\*\*|%/.test(this.op)) {
    check.isNumber(this.left);
    check.isNumber(this.right);
  } else if (/-|&&|\|\|/.test(this.op)) {
    check.isNumberOrBool(this.left);
    check.isNumberOrBool(this.right);
  } else if (/[+]/.test(this.op)) {
    check.isPrimitiveOrString(this.left);
    check.isPrimitiveOrString(this.right);
  } else if (/==|>=?|<=?/.test(this.op)) {
    check.expressionsHaveTheSameType(this.left, this.right);
  }
};

FuncDecl.prototype.analyze = function (context) {
  this.bodyContext = context.createChildContextForFunctionBody();
  // this.params.forEach((p) => p.analyze(this.bodyContext));   // DO WE NEED THIS??
  this.block.analyze(this.bodyContext);
  delete this.bodyContext; // This was only temporary, delete to keep output clean.
  context.add(this.id.ref, this);
};

FuncCall.prototype.analyze = function (context) {
  this.id = context.lookup(this.id.ref);
  check.isFunction(this.id, "Attempt to call a non-function");
  this.params.forEach((param) => param.analyze(context));
  check.legalArguments(this.params, this.id.params);
};

Program.prototype.analyze = function (context) {
  this.statements.forEach((statement) => statement.analyze(context));
};

Block.prototype.analyze = function (context) {
  this.statements.forEach((statement) => statement.analyze(context));
};

ForLoop.prototype.analyze = function (context) {
  this.start.analyze(context);
  check.isInteger(this.start, "Start bound in for");
  this.end.analyze(context);
  check.isInteger(this.end, "High bound in for");
  const bodyContext = context.createChildContextForLoop();
  bodyContext.add(new IntLit(this.start));
  this.block.analyze(bodyContext);
};

// condition, block, elseIfBlocks, elseBlock
Conditional.prototype.analyze = function (context) {
  this.condition.analyze(context);
  check.isPrimitiveOrString(this.condition, "Test in if");
  this.consequent.analyze(context);
  if (this.elseIfBlocks) {
    this.elseIfBlocks.forEach((block) => block.analyze(context));
  }
  if (this.elseBlock) {
    this.elseBlock.analyze(context);
  }
};

ElseIfBlock.prototype.analyze = function (context) {
  this.condition.analyze(context);
  check.isPrimitiveOrString(this.condition, "Test condition");
  this.block.analyze(context);
};

ElseBlock.prototype.analyze = function (context) {
  this.block.analyze(context);
};

NegationExp.prototype.analyze = function (context) {
  this.operand.analyze(context);
  check.isNumber(this.operand, "Operand of negation");
};

ParensExp.prototype.analyze = function (context) {
  this.exp.analyze(context);
};

NotExp.prototype.analyze = function (context) {
  this.operand.analyze(context);
  check.isNumberOrBool(this.operand, "Operand of not");
};

Dict.prototype.analyze = function (context) {
  const usedFields = new Set();
  this.pairs.forEach((pair) => {
    check.fieldHasNotBeenUsed(pair.key, usedFields);
    usedFields.add(pair.key);
    pair.analyze(context);
  });
};

Dict.prototype.getFieldForId = function (id) {
  const pair = this.pairs.find((f) => f.key === id);
  if (!pair) {
    throw new Error("No such pair");
  }
  return pair;
};

KeyValue.prototype.analyze = function (context) {
  this.key.analyze(context);
  this.value.analyze(context);
};

List.prototype.analyze = function (context) {
  this.items.forEach((item) => {
    item.analyze(context);
  });
};

WhileLoop.prototype.analyze = function (context) {
  this.condition.analyze(context);
  check.isPrimitiveOrString(this.condition, "Test in while");
  this.block.analyze(context.createChildContextForLoop());
};

Return.prototype.analyze = function (context) {
  this.exp.analyze(context);
};

Print.prototype.analyze = function (context) {
  this.str.analyze(context);
};

IntLit.prototype.analyze = function (context) {};

FloatLit.prototype.analyze = function (context) {};

Text.prototype.analyze = function (context) {};

Id.prototype.analyze = function (context) {
  // Kind of a hack...
  this.value = context.lookup(this.ref);
};
