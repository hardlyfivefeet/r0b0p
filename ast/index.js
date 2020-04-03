class Program {
  constructor(statements) {
    Object.assign(this, { statements });
  }
}

class Block {
  constructor(statements) {
    Object.assign(this, { statements });
  }
}

class Assignment {
  constructor(id, exp) {
    Object.assign(this, { id, exp });
  }
}

class Return {
  constructor(exp) {
    Object.assign(this, { exp });
  }
}

class FuncDecl {
  constructor(id, params, block) {
    Object.assign(this, { id, params, block });
  }
}

class WhileLoop {
  constructor(condition, block) {
    Object.assign(this, { condition, block });
  }
}

class ForLoop {
  constructor(id, start, end, block) {
    Object.assign(this, { id, start, end, block });
  }
}

class Conditional {
  constructor(condition, block, elseIfBlocks, elseBlock) {
    Object.assign(this, {
      condition,
      block,
      elseIfBlocks,
      elseBlock
    });
  }
}

class ElseIfBlock {
  constructor(condition, block) {
    Object.assign(this, { condition, block });
  }
}

class ElseBlock {
  constructor(block) {
    Object.assign(this, { block });
  }
}

class FuncCall {
  constructor(id, params) {
    Object.assign(this, { id, params });
  }
}

class Print {
  constructor(str) {
    Object.assign(this, { str });
  }
}

class List {
  constructor(items) {
    Object.assign(this, { items });
  }
}

class Dict {
  constructor(pairs) {
    Object.assign(this, { pairs });
  }
}

class KeyValue {
  constructor(key, value) {
    Object.assign(this, { key, value });
  }
}

class BinaryExp {
  constructor(op, left, right) {
    Object.assign(this, { op, left, right });
  }
}

class NegationExp {
  constructor(operand) {
    Object.assign(this, { operand });
  }
}

class ParensExp {
  constructor(exp) {
    Object.assign(this, { exp });
  }
}

class NotExp {
  constructor(operand) {
    Object.assign(this, { operand });
  }
}

class IntLit {
  constructor(value) {
    this.value = +value;
  }
}

class FloatLit {
  constructor(value) {
    this.value = +value;
  }
}

class BoolLit {
  constructor(value) {
    this.value = value;
  }
}

class Text {
  constructor(value) {
    this.value = value;
  }
}

module.exports = {
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
  BoolLit,
  Text
};
