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
  IntLit,
  FloatLit,
  Text,
  Placeholder,
  Id,
} = require("../ast");
const { R0B0P_TRUE, R0B0P_FALSE } = require("../semantics/builtins");

function makeOp(op) {
  return { "==": "===" }[op] || op;
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

// Let's inline the built-in functions, because we can!
const builtin = {
  SQRT([n]) {
    return `Math.sqrt(${n})`;
  },
  ABS([n]) {
    return `Math.abs(${n})`;
  },
  FL00R([n]) {
    return `Math.floor(${n})`;
  },
  CE1L([n]) {
    return `Math.ceil(${n})`;
  },
  R0UND([n]) {
    return `Math.round(${n})`;
  },
  MAX1MUM([list]) {
    return `Math.max(${list})`;
  },
  M1N1MUM([list]) {
    return `Math.min(${list})`;
  },
  UNPR3D1CTABL3() {
    return `Math.random()`;
  },
  PLAC3_AT([list, i, value]) {
    return `${list}.splice(${i}, 0, ${value});`;
  },
  D1SCARD_AT([list, i]) {
    return `${list}.splice(${i}, 1);`;
  },
  R3TR13V3_AT([list, i]) {
    return `${list}[${i}]`;
  },
  SUBST1TUT3([list, i, value]) {
    return `${list}[${i}] = ${value};`;
  },
  S1Z3([list]) {
    return `${list}.length`;
  },
  PLAC3([dict, key, value]) {
    return `${dict}[${key}] = ${value};`;
  },
  D1SCARD([dict, key]) {
    return `delete ${dict}[${key}];`;
  },
  R3TR13V3([dict, key]) {
    return `${dict}[${key}]`;
  },
  C0D3S([dict]) {
    return `Object.keys(${dict})`;
  },
  C0NTA1NS([string, substring]) {
    return `${string}.includes(${substring})`;
  },
  SUBT3XT([string, start, end]) {
    return `${string}.substring(${start}, ${end})`;
  },
  SPL1T([string, separator]) {
    return `${string}.split(${separator})`;
  },
  MAK3_UPP3R([string]) {
    return `${string}.toUpperCase()`;
  },
  MAK3_LOW3R([string]) {
    return `${string}.toLowerCase()`;
  },
};

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
    isAllUpperCase(this.id.name) ? "const" : "let"
  } ${this.id.gen()} = ${this.exp.gen()};`;
};

BinaryExp.prototype.gen = function () {
  return `${this.left.gen()} ${makeOp(this.op)} ${this.right.gen()}`;
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

FuncCall.prototype.gen = function () {
  const args = this.params.map((a) => a.gen());
  if (this.id.builtin) {
    return builtin[this.id.id.name](args);
  }
  return `${javaScriptId(this.id.id)}(${args.join(",")});`;
};

Block.prototype.gen = function () {
  return (
    `{ ` + this.statements.map((statement) => statement.gen()).join("\n") + ` }`
  );
};

ForLoop.prototype.gen = function () {
  const i = javaScriptId(this.id ? this.id : "i");
  const low = this.start.gen();
  const hi = this.end.gen();
  //What is this for???? VV
  // const hi = javaScriptId(new Variable("hi"));
  // const preAssign = `let ${hi} = ${this.high.gen()};`;
  const loopControl = `for (let ${i} = ${low}; ${i} <= ${hi}; ${i}++)`;
  const block = this.block.gen();
  return `${loopControl} {${block}}`;
};

FuncDecl.prototype.gen = function () {
  const name = javaScriptId(this.id);
  const params = this.params.map(javaScriptId);
  const block = this.block.gen();
  return `function ${name} (${params.join(",")}) ${block}`;
};

Id.prototype.gen = function () {
  return javaScriptId(this);
};

Conditional.prototype.gen = function () {
  const thenPart = this.block.gen();
  return `if (${this.condition.gen()}) ${thenPart}
          ${this.elseIfBlocks.forEach((block) => block.gen())}
          ${this.elseBlock.gen()}`;
};

ElseIfBlock.prototype.gen = function () {};

ElseBlock.prototype.gen = function () {};

IntLit.prototype.gen = function () {
  return this.value;
};

FloatLit.prototype.gen = function () {
  return this.value;
};

BoolLit.prototype.gen = function () {
  if (this.value === R0B0P_TRUE) {
    return `true`;
  } else if (this.value === R0B0P_FALSE) {
    return `false`;
  }
};

Text.prototype.gen = function () {
  if (this.placeholders.length > 0) {
    let index = 0;
    let result = "";
    this.placeholders.forEach((placeholder) => {
      const currString = this.quasi.substring(index, placeholder.index);
      result = result + currString + `\$\{${placeholder.exp.gen()}\}`;
      index = placeholder.index + 1;
    });
    return result;
  } else {
    return '"' + this.quasi + '"';
  }
};

NegationExp.prototype.gen = function () {
  return `(- ${this.operand.gen()})`;
};

//Can do this after one of the TODOs
// Nil.prototype.gen = function () {
//   return "null";
// };

Dict.prototype.gen = function () {
  return `{${this.pairs.map((pair) => pair.gen()).join(",")}}`;
};

WhileLoop.prototype.gen = function () {
  return `while (${this.condition.gen()}) ${this.block.gen()} `;
};

function isAllUpperCase(str) {
  return str === str.toUpperCase();
}
