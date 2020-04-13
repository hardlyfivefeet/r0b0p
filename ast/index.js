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
    //For built in functions, since their names are keywords
    if (id.constructor !== Id) {
      id = new Id(id);
    }
    Object.assign(this, { id, params, block });
  }
}

class FuncCall {
  //For built in functions, since their names are keywords
  constructor(id, params) {
    if (id.constructor !== Id) {
      id = new Id(id);
    }
    Object.assign(this, { id, params });
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

class Break {
  constructor() {}
}

class Continue {
  constructor() {}
}

class Conditional {
  constructor(condition, block, elseIfBlocks, elseBlock) {
    Object.assign(this, {
      condition,
      block,
      elseIfBlocks,
      elseBlock,
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

class Print {
  constructor(exp) {
    Object.assign(this, { exp });
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

class Key {
  constructor(name) {
    Object.assign(this, { name });
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
  constructor(quasi, interpolGuys = []) {
    Object.assign(this, { quasi, interpolGuys });
  }
}

class Interpol {
  constructor(exp, index = null) {
    Object.assign(this, { exp, index });
  }
}

class Id {
  constructor(name) {
    Object.assign(this, { name });
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
  IntLit,
  FloatLit,
  BoolLit,
  Text,
  Interpol,
  Id,
};
