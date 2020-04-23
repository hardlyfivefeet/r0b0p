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

const R0B0P_TRUE = "b1p";
const R0B0P_FALSE = "b0p";

// const beautify = require("js-beautify");
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
    if (!map.has(v)) {
      map.set(v, ++lastId); // eslint-disable-line no-plusplus
    }
    return `${v.id}_${map.get(v)}`;
  };
})();

// Let's inline the built-in functions, because we can!
// const builtin = {
//   print([s]) {
//     return `console.log(${s})`;
//   },
//   ord([s]) {
//     return `(${s}).charCodeAt(0)`;
//   },
//   chr([i]) {
//     return `String.fromCharCode(${i})`;
//   },
//   size([s]) {
//     return `${s}.length`;
//   },
//   substring([s, i, n]) {
//     return `${s}.substr(${i}, ${n})`;
//   },
//   concat([s, t]) {
//     return `${s}.concat(${t})`;
//   },
//   not(i) {
//     return `(!(${i}))`;
//   },
//   exit(code) {
//     return `process.exit(${code})`;
//   },
// };

module.exports = function (exp) {
  return beautify(exp.gen(), { indent_size: 2 });
};

// // This only exists because Tiger is expression-oriented and JavaScript is not.
// // It's pretty crazy! In the case where the expression is actually a sequence,
// // we have to dig in and stick a 'return' before the last expression. And this
// // as to be recursive, because the last expression of a sequence could actually
// // be a sequence....
// function makeReturn(exp) {
//   if (exp.constructor === LetExp) {
//     const filteredDecs = exp.decs.filter((d) => d.constructor !== TypeDec);
//     const all = [...filteredDecs, ...exp.body.slice(0, -1)].map((e) => e.gen());
//     all.push(makeReturn(exp.body[exp.body.length - 1]));
//     return all.join(";");
//   }
//   if (exp.constructor === ExpSeq) {
//     const generated = exp.exps.slice(0, -1).map((e) => e.gen());
//     generated.push(makeReturn(exp.exps[exp.exps.length - 1]));
//     return generated.join(";");
//   }
//   return `return ${exp.gen()}`;
// }
Program.prototype.gen = function () {
  this.statements.map((statement) => statement.gen()).join(";");
};

List.prototype.gen = function () {
  return `Array(${this.items.length().gen()}).fill(${this.items.gen()})`;
};

Assignment.prototype.gen = function () {
  return `${this.id.gen()} = ${this.exp.gen()}`;
};

BinaryExp.prototype.gen = function () {
  return `(${this.left.gen()} ${makeOp(this.op)} ${this.right.gen()})`;
};

KeyValue.prototype.gen = function () {
  return `${this.key.gen()} : ${this.value.gen()}`;
};

Break.prototype.gen = function () {
  return "break";
};

FuncCall.prototype.gen = function () {
  const args = this.params.map((a) => a.gen());
  //Is this attached to the Id, this, or neither?
  if (this.builtin) {
    //Haven't done this yet
    return builtin[this.callee.id](args);
  }
  return `${javaScriptId(this.callee)}(${args.join(",")})`;
};

Block.prototype.gen = function () {
  return (
    `{ ` + this.statements.map((statement) => statement.gen()).join(";") + ` }`
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
  return `function ${name} (${params.join(",")}) {${block}}`;
};

Id.prototype.gen = function () {
  return javaScriptId(this.name);
};

Conditional.prototype.gen = function () {
  const thenPart = this.block.gen();
  return `if (${this.condition.gen()}) ${thenPart}
          ${this.elseIfBlocks.forEach((block) => block.gen())}
          ${this.elseBlock.gen()}`;
};

ElseIfBlock.prototype.gen = function () { };

ElseBlock.prototype.gen = function () { };

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
  //deal with quasi and placeholders :(
};

NegationExp.prototype.gen = function () {
  return `(- (${this.operand.gen()}))`;
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
