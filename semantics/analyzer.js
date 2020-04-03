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
  Text
} = require("../ast");
const check = require("./check");
const Context = require("./context");

module.exports = function(exp) {
  exp.analyze(Context.INITIAL);
};

Assignment.prototype.analyze = function(context) {
  this.exp.analyze(context);
  let initialized = true;
  try {
    context.lookup(this.id);
  } catch (err) {
    initialized = false;
  }
  if (initialized) {
    check.isNotReadOnly(this.id);
  }
  console.log("check3");
  context.add(this);
  console.log("added to context!!!" + this.id);
};

BinaryExp.prototype.analyze = function(context) {
  this.left.analyze(context);
  this.right.analyze(context);

  if (/\/|*|**|%/.test(this.op)) {
    check.isNumber(this.left);
    check.isNumber(this.right);
  } else if (/-|&&|\|\|/.test(this.op)) {
    check.isNumberOrBool(this.left);
    check.isNumberOrBool(this.right);
  } else if (/+/.test(this.op)) {
    check.isPrimitiveOrString(this.left);
    check.isPrimitiveOrString(this.right);
  } else if (/==|>=?|<=?/.test(this.op)) {
    check.expressionsHaveTheSameType(this.left, this.right);
  }
};

FuncCall.prototype.analyze = function(context) {
  this.name = context.lookup(this.name);
  check.isFunction(this.name, "Attempt to call a non-function");
  this.params.forEach(param => param.analyze(context));
  check.legalArguments(this.params, this.name.params);
};

Program.prototype.analyze = function(context) {
  this.statements.forEach(statement => statement.analyze(context));
};

Block.prototype.analyze = function(context) {
  this.statements.forEach(statement => statement.analyze(context));
};

ForLoop.prototype.analyze = function(context) {
  this.start.analyze(context);
  check.isInteger(this.start, "Start bound in for");
  this.end.analyze(context);
  check.isInteger(this.end, "High bound in for");
  const bodyContext = context.createChildContextForLoop();
  bodyContext.add(new IntLit(this.start));
  this.block.analyze(bodyContext);
};

// Function analysis is broken up into two parts in order to support (nutual)
// recursion. First we have to do semantic analysis just on the signature
// (including the return type). This is so other functions that may be declared
// before this one have calls to this one checked.
FuncDecl.prototype.analyzeSignature = function(context) {
  this.bodyContext = context.createChildContextForFunctionBody();
  this.params.forEach(p => p.analyze(this.bodyContext));
};

FuncDecl.prototype.analyze = function() {
  this.block.analyze(this.bodyContext);
  delete this.bodyContext; // This was only temporary, delete to keep output clean.
};

// condition, block, elseIfBlocks, elseBlock
Conditional.prototype.analyze = function(context) {
  this.condition.analyze(context);
  check.isPrimitiveOrString(this.condition, "Test in if");
  this.consequent.analyze(context);
  if (this.elseIfBlocks) {
    this.elseIfBlocks.forEach(block => block.analyze(context));
  }
  if (this.elseBlock) {
    this.elseBlock.analyze(context);
  }
};

ElseIfBlock.prototype.analyze = function(context) {
  this.condition.analyze(context);
  check.isPrimitiveOrString(this.condition, "Test condition");
  this.block.analyze(context);
};

ElseBlock.prototype.analyze = function(context) {
  this.block.analyze(context);
};

NegationExp.prototype.analyze = function(context) {
  this.operand.analyze(context);
  check.isNumber(this.operand, "Operand of negation");
};

ParensExp.prototype.analyze = function(context) {
  this.exp.analyze(context);
};

NotExp.prototype.analyze = function(context) {
  this.operand.analyze(context);
  check.isNumberOrBool(this.operand, "Operand of not");
};

Dict.prototype.analyze = function(context) {
  const usedFields = new Set();
  this.pairs.forEach(pair => {
    check.fieldHasNotBeenUsed(pair.key, usedFields);
    usedFields.add(pair.key);
    pair.analyze(context);
  });
};

Dict.prototype.getFieldForId = function(id) {
  const pair = this.pairs.find(f => f.key === id);
  if (!pair) {
    throw new Error("No such pair");
  }
  return pair;
};

KeyValue.prototype.analyze = function(context) {
  this.key.analyze(context);
  this.value.analyze(context);
};

List.prototype.analyze = function(context) {
  this.items.forEach(item => {
    item.analyze(context);
  });
};

WhileLoop.prototype.analyze = function(context) {
  this.condition.analyze(context);
  check.isPrimitiveOrString(this.condition, "Test in while");
  this.block.analyze(context.createChildContextForLoop());
};

Return.prototype.analyze = function(context) {
  this.exp.analyze(context);
};

Print.prototype.analyze = function(context) {
  this.str.analyze(context);
};

IntLit.prototype.analyze = function(context) {};

FloatLit.prototype.analyze = function(context) {};

Text.prototype.analyze = function(context) {};
