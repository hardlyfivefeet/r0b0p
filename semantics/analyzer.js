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
  NotExp,
  BoolLit,
  Undefined,
  IntLit,
  FloatLit,
  Text,
  Placeholder,
  Id,
} = require("../ast");
const { R0B0P_TRUE } = require("./builtins");

const check = require("./check");
const Context = require("./context");

module.exports = function (program) {
  program.analyze(Context.INITIAL);
};

Assignment.prototype.analyze = function (context) {
  this.exp.analyze(context);
  if (!context.lookup(this.id)) {
    check.ifAssigningVarToFunc(context, this.id.name);
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
  check.ifAssigningFuncToVar(context, this.id);

  //If the function has been initalized before, aka the id has already been used,
  //check to see if it's readonly.
  if (context.lookupFunctionByName(this.id.name)) {
    check.isNotReadOnly(this.id.name);
  }

  this.bodyContext = context.createChildContextForFunctionBody(this);
  this.params.forEach((p) => this.bodyContext.add(p));
  context.addFunction(this.id.name, this); // allows for recursive functions
  this.block.analyze(this.bodyContext);
  delete this.bodyContext; // This was only temporary, delete to keep output clean.
};

FuncCall.prototype.analyze = function (context) {
  const lookupResult = context.lookupFunctionByName(this.id.name);
  // If the function can't be found, it might be a parameter to the parent function.
  if (!lookupResult) {
    check.ifInFunction(context);
    check.ifIdIsParam(this.id.name, context.currentFunction.params);
  } else {
    this.id = lookupResult;
    check.ifLegalArguments(this.params, this.id.params); // Checks whether the lengths match
    this.params.forEach((param) => param.analyze(context));
  }
};

Program.prototype.analyze = function (context) {
  const programContext = context.createChildContextForBlock();
  this.statements.forEach((statement) => statement.analyze(programContext));
  check.localsAreUnused(programContext);
};

Block.prototype.analyze = function (context) {
  const newContext = context.createChildContextForBlock();
  this.statements.forEach((statement) => {
    //If we've seen a return or break, then the following statements are unreachable.
    //This only applies to statements at the level of the block, so nested return
    //statements whose block is followed by more statements will not be affected.
    check.ifCodeUnreachableAfterBreakOrReturn(
      newContext.seenReturn || newContext.seenBreak
    );
    statement.analyze(newContext);
  });
  //If we're in a potential infinite loop and we haven't seen a break then we have a problem.
  check.insidePotentialInfiniteLoop(newContext);
  check.localsAreUnused(newContext);
};

ForLoop.prototype.analyze = function (context) {
  this.start.analyze(context);
  this.end.analyze(context);
  this.bodyContext = context.createChildContextForLoop();
  if (this.id) {
    // If there is an id assigned to the iterator variable (aka i:1->50)
    this.bodyContext.add(this.id);
  }
  this.block.analyze(this.bodyContext);
  delete this.bodyContext;
};

Conditional.prototype.analyze = function (context) {
  check.ifCodeUnreachableWithCondition(this.condition);
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
  check.ifCodeUnreachableWithCondition(this.condition);
  this.condition.analyze(context);
  this.block.analyze(context);
};

ElseBlock.prototype.analyze = function (context) {
  this.block.analyze(context);
};

NegationExp.prototype.analyze = function (context) {
  this.operand.analyze(context);
};

NotExp.prototype.analyze = function (context) {
  this.operand.analyze(context);
};

Dict.prototype.analyze = function (context) {
  const usedFields = new Set();
  this.pairs.forEach((pair) => {
    check.fieldNotAlreadyDeclared(pair.key.name, usedFields);
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
  check.ifCodeUnreachableWithCondition(this.condition);
};

Break.prototype.analyze = function (context) {
  check.ifInLoop(context);
  context.seenBreak = true;
};

Continue.prototype.analyze = function (context) {
  check.ifInLoop(context);
};

Return.prototype.analyze = function (context) {
  check.ifInFunction(context);
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
  check.isNotUndeclaredVariable(lookupResult, this.name);
  lookupResult.referenced = true;
  // this.value = this.name; // wait I dont think we need this anymore ??
};

BoolLit.prototype.analyze = function (context) {};

IntLit.prototype.analyze = function (context) {};

FloatLit.prototype.analyze = function (context) {};

Undefined.prototype.analyze = function (context) {};
