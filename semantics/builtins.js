const { FuncDecl } = require("../ast");

const standardFunctions = [
  new FuncDecl("SQRT", ["n"]),
  new FuncDecl("ABS", ["n"]),
  new FuncDecl("FLOOR", ["n"]),
  new FuncDecl("PLAC3_AT", ["list", "index", "value"]),
  new FuncDecl("D1SCARD_AT", ["list", "index"]),
  new FuncDecl("R3TR13V3_AT", ["list", "index"]),
  new FuncDecl("SUBST1TUT3", ["list", "index", "value"]),
  new FuncDecl("S1Z3", ["list"]),

  new FuncDecl("PLAC3", ["dict", "key", "value"]),
  new FuncDecl("D1SCARD", ["dict", "key"]),
  new FuncDecl("R3TR13V3", ["dict", "key"]),
  new FuncDecl("C0D3S", ["dict"])
];

/* eslint-disable no-param-reassign */
standardFunctions.forEach(f => {
  f.builtin = true;
});
/* eslint-enable no-param-reassign */

module.exports = { standardFunctions };