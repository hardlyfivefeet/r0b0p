/*
 * Translation to JavaScript
 *
 * Requiring this module adds a gen() method to each of the AST classes, except
 * for types, and fields, which don’t figure into code generation. It exports a
 * function that generates a complete, pretty-printed JavaScript program for a
 * Tiger expression, bundling the translation of the Tiger standard library with
 * the expression's translation.
 *
 * Each gen() method returns a fragment of JavaScript.
 *
 *   const generate = require('./backend/javascript-generator');
 *   generate(tigerExpression);
 */

const beautify = require("js-beautify");
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
  ElseBlock,
  ElseIfBlock,
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
  Id,
} = require("../ast");
const { R0B0P_TRUE } = require("../semantics/builtins");
const { builtin } = require("./generator_builtins");

function makeOp(op) {
  return { "==": "===" }[op] || op;
}

function isAllUpperCase(str) {
  return str === str.toUpperCase();
}

// javaScriptId(e) takes any r0b0p object with an id property, such as a Variable,
// Param, or Func, and produces a JavaScript name by appending a unique identifying
// suffix, such as '_1' or '_503'. It uses a cache so it can return the same exact
// string each time it is called with a particular entity.
const javaScriptId = (() => {
  let lastId = 0;
  const map = new Map();
  return (v) => {
    if (!map.has(v.name)) {
      map.set(v.name, ++lastId); // eslint-disable-line no-plusplus
    }
    return `${v.name}_${map.get(v.name)}`;
  };
})();

module.exports = function (exp) {
  return beautify(exp.gen(), { indent_size: 2 });
};

Program.prototype.gen = function () {
  return this.statements.map((statement) => statement.gen()).join("\n");
};

Return.prototype.gen = function () {
  return "return " + this.exp.gen() + ";";
};

Print.prototype.gen = function () {
  return `console.log(${this.exp.gen()});`;
};

List.prototype.gen = function () {
  return `[${this.items.map((item) => item.gen()).join(",")}]`;
};

Assignment.prototype.gen = function () {
  return `${
    isAllUpperCase(this.id.name) ? "const" : this.firstAssignment ? "let" : ""
  } ${this.id.gen()} = ${this.exp.gen()};`;
};

BinaryExp.prototype.gen = function () {
  return `${this.left.gen()} ${makeOp(this.op)} ${this.right.gen()}`;
};

NotExp.prototype.gen = function () {
  return `!${this.exp.gen()}`;
};

KeyValue.prototype.gen = function () {
  return `${this.key.gen()} : ${this.value.gen()}`;
};

Key.prototype.gen = function () {
  return this.name;
};

Break.prototype.gen = function () {
  return "break;";
};

Continue.prototype.gen = function () {
  return "continue;";
};

FuncDecl.prototype.gen = function () {
  const name = javaScriptId(this.id);
  const params = this.params.map(javaScriptId);
  const block = this.block.gen();
  return `function ${name} (${params.join(",")}) ${block}`;
};

FuncCall.prototype.gen = function () {
  const args = this.params.map((a) => a.gen());
  if (this.id.builtin) {
    return builtin[this.id.id.name](args);
  }

  //If we do not have this.id.id, that means that the function has not been declared yet,
  //which is legal in some cases such as callback functions passed in as parameters.
  if (this.id.id) {
    return `${javaScriptId(this.id.id)}(${args.join(",")})`;
  } else {
    return `${javaScriptId(this.id)}(${args.join(",")})`;
  }
};

FuncCallStmt.prototype.gen = function () {
  return `${this.func.gen()};`;
};

Block.prototype.gen = function () {
  return (
    `{ ` + this.statements.map((statement) => statement.gen()).join("\n") + ` }`
  );
};

ForLoop.prototype.gen = function () {
  const i = javaScriptId(this.id ? this.id : new Id("i"));
  const low = this.start.gen();
  const hi = this.end.gen();
  const loopControl = `for (let ${i} = ${low}; ${i} < ${hi}; ${i}++)`;
  const block = this.block.gen();
  return `${loopControl} ${block}`;
};

Id.prototype.gen = function () {
  return javaScriptId(this);
};

Conditional.prototype.gen = function () {
  const thenPart = this.block.gen();

  let elseIfBlocks = "";
  if (this.elseIfBlocks.length !== 0) {
    this.elseIfBlocks.forEach((block) => {
      elseIfBlocks += block.gen();
    });
  }
  const elseBlock = this.elseBlock === null ? "" : this.elseBlock.gen();
  return `if (${this.condition.gen()}) ${thenPart}
          ${elseIfBlocks}
          ${elseBlock}`;
};

ElseIfBlock.prototype.gen = function () {
  const thenPart = this.block.gen();
  return `else if (${this.condition.gen()}) ${thenPart}`;
};

ElseBlock.prototype.gen = function () {
  return `else ${this.block.gen()}`;
};

IntLit.prototype.gen = function () {
  return this.value;
};

FloatLit.prototype.gen = function () {
  return this.value;
};

BoolLit.prototype.gen = function () {
  if (this.value === R0B0P_TRUE) {
    return `true`;
  } else {
    return `false`;
  }
};

Text.prototype.gen = function () {
  if (this.placeholders.length > 0) {
    let index = 0;
    let result = "";
    this.placeholders.forEach((placeholder) => {
      const currString = this.quasi.substring(index, placeholder.index);
      result = result + currString + `$\{${placeholder.exp.gen()}}`;
      index = placeholder.index;
    });
    result = result + this.quasi.substring(index);
    return `\`${result}\``;
  } else {
    return `"${this.quasi}"`;
  }
};

NegationExp.prototype.gen = function () {
  return `(- ${this.exp.gen()})`;
};

Undefined.prototype.gen = function () {
  return "null";
};

Dict.prototype.gen = function () {
  return `{${this.pairs.map((pair) => pair.gen()).join(",")}}`;
};

WhileLoop.prototype.gen = function () {
  return `while (${this.condition.gen()}) ${this.block.gen()} `;
};
