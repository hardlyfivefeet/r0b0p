/* eslint no-unused-vars: 0 */ // --> OFF
// The semantic analyzer

const {
  Program,
  Block,
  Assignment,
  Return,
  FuncDecl,
  WhileLoop,
  ForLoop,
  Break,
  Continue,
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
  Interpol,
  Id,
} = require("../ast");
const check = require("./check");
const Context = require("./context");

module.exports = function (exp) {
  exp.analyze(Context.INITIAL);
};

// Assignment.prototype.analyze = function (context) {
//   this.exp.analyze(context);
//   let initialized = true;
//   try {
//     context.lookup(this.id.name);
//   } catch (err) {
//     // check that id hasn't already been declared as a function
//     check.assigningVarToFunc(context, this.id.name);
//     initialized = false;
//   }
//   if (initialized) {
//     check.isNotReadOnly(this.id.name);
//   }
//   context.add(this.id.name);
// };

Assignment.prototype.analyze = function (context) {
  this.exp.analyze(context);
  if (!context.lookup(this.id.name)) {
    check.assigningVarToFunc(context, this.id.name);
  } else {
    check.isNotReadOnly(this.id.name);
  }
  context.add(this.id.name);
};

BinaryExp.prototype.analyze = function (context) {
  this.left.analyze(context);
  this.right.analyze(context);
};

FuncDecl.prototype.analyze = function (context) {
  // checks that func id hasn't already been declared as a var
  check.assigningFuncToVar(context, this.id.name);

  //If the function has been initalized before, aka the id has already been used,
  //check to see if it's readonly.
  if (context.lookupFunction(this.id.name)) {
    check.isNotReadOnly(this.id.name);
  }

  this.bodyContext = context.createChildContextForFunctionBody(this);
  this.params.forEach((p) => this.bodyContext.add(p.name));
  context.addFunction(this.id.name, this); // allows for recursive functions
  this.block.analyze(this.bodyContext);
  delete this.bodyContext; // This was only temporary, delete to keep output clean.
};

FuncCall.prototype.analyze = function (context) {
  const lookupResult = context.lookupFunction(this.id.name);
  // If the function can't be found, it might be a parameter to the parent function.
  if (!lookupResult) {
    check.inFunction(context);
    check.isParam(this.id.name, context.currentFunction.params);
  } else {
    this.id = lookupResult;
    check.legalArguments(this.params, this.id.params); // Checks whether the lengths match
    this.params.forEach((param) => param.analyze(context));
  }
};

Program.prototype.analyze = function (context) {
  this.statements.forEach((statement) => statement.analyze(context));
  //the end, check for unused variables
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
    // If there is an id assigned to the iterator variable (aka i:1->50)
    bodyContext.add(this.id.name);
  }
  this.block.analyze(bodyContext);
};

Conditional.prototype.analyze = function (context) {
  check.unreachableCodeWithCondition(this.condition);
  this.condition.analyze(context);
  this.block.analyze(context);
  if (this.elseIfBlocks.length !== 0) {
    this.elseIfBlocks.forEach((elseIf) => elseIf.analyze(context));
  }
  if (this.elseBlock) {
    this.elseBlock.analyze(context);
  }
};

ElseIfBlock.prototype.analyze = function (context) {
  check.unreachableCodeWithCondition(this.condition);
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
    check.fieldAlreadyDeclared(pair.key.name, usedFields);
    usedFields.add(pair.key.name);
    pair.analyze(context);
  });
};

KeyValue.prototype.analyze = function (context) {
  this.key.analyze(context);
  this.value.analyze(context);
};

Key.prototype.analyze = function (context) { };

List.prototype.analyze = function (context) {
  this.items.forEach((item) => {
    item.analyze(context);
  });
};

WhileLoop.prototype.analyze = function (context) {
  this.condition.analyze(context);
  const childContext = context.createChildContextForLoop();
  this.block.analyze(childContext);
  check.unreachableCodeWithCondition(this.condition);
  // only want to do the following, if we can figure out that there's a break:
  // check.potentialInfiniteLoop(this.condition);
};

Break.prototype.analyze = function (context) {
  check.inLoop(context);
};

Continue.prototype.analyze = function (context) {
  check.inLoop(context);
};

Return.prototype.analyze = function (context) {
  check.inFunction(context);
  this.exp.analyze(context);
};

Print.prototype.analyze = function (context) {
  this.exp.analyze(context);
};

Text.prototype.analyze = function (context) {
  this.interpolGuys.forEach((interpol) => interpol.analyze(context));
};

Interpol.prototype.analyze = function (context) {
  this.exp.analyze(context);
};

Id.prototype.analyze = function (context) {
  if (!context.lookup(this.name)) {
    throw new Error(
      `Bip beeep! Human has undeclared variable ${this.name}. That is not allowed.`
    );
  }
  this.value = this.name;
};

BoolLit.prototype.analyze = function (context) { };

IntLit.prototype.analyze = function (context) { };

FloatLit.prototype.analyze = function (context) { };
