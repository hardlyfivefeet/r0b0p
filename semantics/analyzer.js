/* eslint no-unused-vars: 0 */ // --> OFF
// The semantic analyzer

const R0B0P_TRUE = "b1p";

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
  Placeholder,
  Id,
} = require("../ast");

const check = require("./check");
const Context = require("./context");

module.exports = function (program) {
  program.analyze(Context.INITIAL);
};

Assignment.prototype.analyze = function (context) {
  this.exp.analyze(context);
  if (!context.lookup(this.id)) {
    check.assigningVarToFunc(context, this.id.name);
    context.add(this.id);
  } else {
    check.isNotReadOnly(this.id.name);
  }
};

BinaryExp.prototype.analyze = function (context) {
  this.left.analyze(context);
  this.right.analyze(context);
};

FuncDecl.prototype.analyze = function (context) {
  // checks that func id hasn't already been declared as a var
  check.assigningFuncToVar(context, this.id);

  //If the function has been initalized before, aka the id has already been used,
  //check to see if it's readonly.
  if (context.lookupFunction(this.id.name)) {
    check.isNotReadOnly(this.id.name);
  }

  this.bodyContext = context.createChildContextForFunctionBody(this);
  this.params.forEach((p) => this.bodyContext.add(p));
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
  const programContext = context.createChildContextForBlock();
  this.statements.forEach((statement) => statement.analyze(programContext));
  check.unusedLocals(programContext);
};

Block.prototype.analyze = function (context) {
  const newContext = context.createChildContextForBlock();
  this.statements.forEach((statement) => {
    //If we've seen a return or break, then the following statements are unreachable.
    check.unreachableCodeAfterBreakOrReturn(
      newContext.seenReturn || newContext.seenBreak
    );
    statement.analyze(newContext);
  });
  //If we're in a potential infinite loop and we haven't seen a break then we have a problem.
  check.potentialInfiniteLoop(newContext);
  check.unusedLocals(newContext);
};

ForLoop.prototype.analyze = function (context) {
  this.start.analyze(context);
  this.end.analyze(context);
  const bodyContext = context.createChildContextForLoop();
  if (this.id) {
    // If there is an id assigned to the iterator variable (aka i:1->50)
    bodyContext.add(this.id);
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

Key.prototype.analyze = function (context) {};

List.prototype.analyze = function (context) {
  this.items.forEach((item) => {
    item.analyze(context);
  });
};

WhileLoop.prototype.analyze = function (context) {
  this.condition.analyze(context);
  const childContext = context.createChildContextForLoop();
  //If there's a "While true" loop, we trigger that as a potential infinite loop.
  if (
    this.condition.constructor === BoolLit &&
    this.condition.value === R0B0P_TRUE
  ) {
    childContext.potentialInfiniteLoop = true;
  }
  this.block.analyze(childContext);
  //If there's a "While false" loop, we trigger that as unreachable code.
  check.unreachableCodeWithCondition(this.condition);
};

Break.prototype.analyze = function (context) {
  check.inLoop(context);
  context.seenBreak = true;
};

Continue.prototype.analyze = function (context) {
  check.inLoop(context);
};

Return.prototype.analyze = function (context) {
  check.inFunction(context);
  this.exp.analyze(context);
  context.seenReturn = true;
};

Print.prototype.analyze = function (context) {
  this.exp.analyze(context);
};

Text.prototype.analyze = function (context) {
  this.placeholders.forEach((placeholder) => placeholder.analyze(context));
};

Placeholder.prototype.analyze = function (context) {
  this.exp.analyze(context);
};

Id.prototype.analyze = function (context) {
  const lookupResult = context.lookup(this);
  if (!lookupResult) {
    throw new Error(
      `Bip beeep! Human has undeclared variable ${this.name}. That is not allowed.`
    );
  }
  lookupResult.referenced = true;
  this.value = this.name;
};

BoolLit.prototype.analyze = function (context) {};

IntLit.prototype.analyze = function (context) {};

FloatLit.prototype.analyze = function (context) {};
