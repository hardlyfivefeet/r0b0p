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
  constructor(name, params, statements) {
    Object.assign(this, { name, params, statements });
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
  constructor(condition, block, elseIfBlock, elseBlock) {
    Object.assign(this, {
      condition,
      block,
      elseIfBlock,
      elseBlock
    });
  }
}

class FuncCall {
  constructor(name, params) {
    Object.assign(this, { name, params });
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

class BinaryExp {
  constructor(left, right) {
    Object.assign(this, { left, right });
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

class SimpleStatement {
  constructor(statement) {
    Object.assign(this, { statement });
  }
}

module.exports = {
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
};