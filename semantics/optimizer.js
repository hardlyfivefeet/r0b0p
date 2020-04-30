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

const { R0B0P_TRUE, R0B0P_FALSE } = require("./builtins.js");

module.exports = (program) => program.optimize();

function isZero(e) {
  return isNumLit(e) && e.value === 0;
}

function isOne(e) {
  return isNumLit(e) && e.value === 1;
}

function bothNumLits(b) {
  return isNumLit(b.left) && isNumLit(b.right);
}

function isNumLit(n) {
  return isIntLit(n) || isFloatLit(n);
}

function isIntLit(n) {
  return n instanceof IntLit;
}

function isFloatLit(n) {
  return n instanceof FloatLit;
}

function isTrue(b) {
  return b instanceof BoolLit && b.value === R0B0P_TRUE;
}

function isFalse(b) {
  return b instanceof BoolLit && b.value === R0B0P_FALSE;
}

function isUndefined(e) {
  return e instanceof Undefined;
}

function reduceBlockToStatement(block) {
  if (block.statements.length === 1) {
    return block.statements[0];
  }
  return block;
}

Program.prototype.optimize = function () {
  this.statements = this.statements.map((s) => s.optimize());
  this.statements.filter((s) => !isUndefined(s));
};

List.prototype.optimize = function () {
  this.items = this.items.map((item) => item.optimize());
  return this;
};

Assignment.prototype.optimize = function () {
  this.id = this.id.optimize();
  this.exp = this.exp.optimize();
  if (this.id === this.exp) {
    return null;
  }
  return this;
};

BinaryExp.prototype.optimize = function () {
  this.left = this.left.optimize();
  this.right = this.right.optimize();
  if (this.op === "+" && isZero(this.right)) return this.left;
  if (this.op === "+" && isZero(this.left)) return this.right;
  if (this.op === "*" && isZero(this.right)) return new IntLit(0);
  if (this.op === "*" && isZero(this.left)) return new IntLit(0);
  if (this.op === "*" && isOne(this.right)) return this.left;
  if (this.op === "*" && isOne(this.left)) return this.right;
  if (bothNumLits(this)) {
    const [x, y] = [this.left.value, this.right.value];
    if (this.op === "+") return new FloatLit(x + y);
    if (this.op === "*") return new FloatLit(x * y);
    if (this.op === "/") return new FloatLit(x / y);
  }
  return this;
};

Break.prototype.optimize = function () {
  return this;
};

Continue.prototype.optimize = function () {
  return this;
};

Return.prototype.optimize = function () {
  this.exp = this.exp.optimize();
  return this;
};

Print.prototype.optimize = function () {
  this.exp = this.exp.optimize();
  return this;
};

FuncCall.prototype.optimize = function () {
  this.params = this.params.map((a) => a.optimize());
  return this;
};

FuncCallStmt.prototype.optimize = function () {
  this.func = this.func.optimize();
  return this;
};

Block.prototype.optimize = function () {
  this.statements = this.statements.map((s) => s.optimize());
  return this;
};

ForLoop.prototype.optimize = function () {
  this.start = this.start.optimize();
  this.end = this.end.optimize();
  this.block = reduceBlockToStatement(this.block);
  this.block = this.block.optimize();
  return this;
};

FuncDecl.prototype.optimize = function () {
  this.block = this.block.optimize();
  return this;
};

Id.prototype.optimize = function () {
  return this;
};

Conditional.prototype.optimize = function () {
  this.condition = this.condition.optimize();
  this.block = reduceBlockToStatement(this.block);
  this.block = this.block.optimize();
  this.elseIfBlocks = this.elseIfBlocks.map((block) => block.optimize());
  if (this.elseBlock) {
    this.elseBlock = this.elseBlock.optimize();
  }
  return this;
};

ElseIfBlock.prototype.optimize = function () {
  this.condition = this.condition.optimize();
  if (isFalse(this.condition)) {
    return new Undefined();
  }
  this.block = reduceBlockToStatement(this.block);
  this.block = this.block.optimize();
  return this;
};

ElseBlock.prototype.optimize = function () {
  this.block = reduceBlockToStatement(this.block);
  this.block = this.block.optimize();
  return this;
};

IntLit.prototype.optimize = function () {
  return this;
};

FloatLit.prototype.optimize = function () {
  return this;
};

BoolLit.prototype.optimize = function () {
  return this;
};

Text.prototype.optimize = function () {
  this.placeholders = this.placeholders.map((placeholder) =>
    placeholder.optimize()
  );
  return this;
};

Placeholder.prototype.optimize = function () {
  this.exp = this.exp.optimize();
  return this;
};

NegationExp.prototype.optimize = function () {
  this.operand = this.operand.optimize();
  if (isNumLit(this.operand)) {
    return new FloatLit(-this.operand.value);
  }
  return this;
};

NotExp.prototype.optimize = function () {
  this.operand = this.operand.optimize();
  if (isFalse(this.operand)) {
    return new BoolLit(R0B0P_TRUE);
  } else if (isTrue(this.operand)) {
    return new BoolLit(R0B0P_FALSE);
  }
  return this;
};

Undefined.prototype.optimize = function () {
  return this;
};

Dict.prototype.optimize = function () {
  this.pairs = this.pairs.map((pair) => pair.optimize());
  return this;
};

KeyValue.prototype.optimize = function () {
  this.value = this.value.optimize();
  return this;
};

WhileLoop.prototype.optimize = function () {
  this.condition = this.condition.optimize();
  // While-false is a no-operation, don't even need the body
  if (isFalse(this.condition)) {
    return new Undefined();
  }
  this.block = reduceBlockToStatement(this.block);
  this.block = this.block.optimize();
  return this;
};
