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
  Key,
  BinaryExp,
  NegationExp,
  ParensExp,
  NotExp,
  BoolLit,
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
  context.add(this.id.ref);
};

BinaryExp.prototype.analyze = function (context) {
  this.left.analyze(context);
  this.right.analyze(context);
};

FuncDecl.prototype.analyze = function (context) {
  this.bodyContext = context.createChildContextForFunctionBody();
  this.params.forEach((p) => this.bodyContext.add(p.ref));
  context.addFunction(this.id.ref, this); // allows for recursive functions
  this.block.analyze(this.bodyContext);
  delete this.bodyContext; // This was only temporary, delete to keep output clean.
};

FuncCall.prototype.analyze = function (context) {
  this.id = context.lookupFunction(this.id.ref);
  this.params.forEach((param) => param.analyze(context));
  check.legalArguments(this.params, this.id.params); // Checks whether the lengths match
};

Program.prototype.analyze = function (context) {
  this.statements.forEach((statement) => statement.analyze(context));
};

Block.prototype.analyze = function (context) {
  const newContext = context.createChildContextForBlock();
  this.statements.forEach((statement) => statement.analyze(newContext));
};

ForLoop.prototype.analyze = function (context) {
  this.start.analyze(context);
  this.end.analyze(context);
  const bodyContext = context.createChildContextForLoop();
  if (this.id) {
    //If there is an id assigned to the iterator variable (aka i:1->50)
    bodyContext.add(this.id.ref);
  }
  this.block.analyze(bodyContext);
};

Conditional.prototype.analyze = function (context) {
  this.condition.analyze(context);
  this.block.analyze(context);
  if (this.elseIfBlocks.length !== 0) {
    this.elseIfBlocks.forEach((block) => block.analyze(context));
  }
  if (this.elseBlock) {
    this.elseBlock.analyze(context);
  }
};

ElseIfBlock.prototype.analyze = function (context) {
  this.condition.analyze(context);
  this.block.analyze(context);
};

ElseBlock.prototype.analyze = function (context) {
  this.block.analyze(context);
};

NegationExp.prototype.analyze = function (context) {
  this.operand.analyze(context);
};

ParensExp.prototype.analyze = function (context) {
  this.exp.analyze(context);
};

NotExp.prototype.analyze = function (context) {
  this.operand.analyze(context);
};

Dict.prototype.analyze = function (context) {
  const usedFields = new Set();
  this.pairs.forEach((pair) => {
    check.fieldHasNotBeenUsed(pair.key.name, usedFields);
    usedFields.add(pair.key.name);
    pair.analyze(context);
  });
};

// We don't really need this bc our member access function is a builtin function?
// Dict.prototype.getFieldForId = function (id) {
//   const pair = this.pairs.find((f) => f.key === id);
//   if (!pair) {
//     throw new Error("No such pair");
//   }
//   return pair;
// };

KeyValue.prototype.analyze = function (context) {
  this.key.analyze(context);
  this.value.analyze(context);
};

Key.prototype.analyze = function (context) {};

List.prototype.analyze = function (context) {
  this.items.forEach((item) => {
    item.analyze(context);
  });
};

WhileLoop.prototype.analyze = function (context) {
  this.condition.analyze(context);
  this.block.analyze(context.createChildContextForLoop());
};

Return.prototype.analyze = function (context) {
  this.exp.analyze(context);
};

Print.prototype.analyze = function (context) {
  this.str.analyze(context);
};

BoolLit.prototype.analyze = function (context) {};

IntLit.prototype.analyze = function (context) {};

FloatLit.prototype.analyze = function (context) {};

Text.prototype.analyze = function (context) {};

Id.prototype.analyze = function (context) {
  // Kind of a hack... ¯\_(ツ)_/¯
  this.value = context.lookup(this.ref);
};
