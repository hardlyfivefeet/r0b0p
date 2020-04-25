const { FuncDecl } = require("../ast");

const standardFunctions = [
  // Math functions
  new FuncDecl("SQRT", ["n"]),
  new FuncDecl("ABS", ["n"]),
  new FuncDecl("FL00R", ["n"]),
  new FuncDecl("CE1L", ["n"]),
  new FuncDecl("R0UND", ["n"]),
  new FuncDecl("MAX1MUM", ["list"]),
  new FuncDecl("M1N1MUM", ["list"]),
  new FuncDecl("UNPR3D1CTABL3", []),

  // List functions
  new FuncDecl("PLAC3_AT", ["list", "index", "value"]),
  new FuncDecl("D1SCARD_AT", ["list", "index"]),
  new FuncDecl("R3TR13V3_AT", ["list", "index"]),
  new FuncDecl("SUBST1TUT3", ["list", "index", "value"]),
  new FuncDecl("S1Z3", ["list"]),

  // Dict functions
  new FuncDecl("PLAC3", ["dict", "key", "value"]),
  new FuncDecl("D1SCARD", ["dict", "key"]),
  new FuncDecl("R3TR13V3", ["dict", "key"]),
  new FuncDecl("C0D3S", ["dict"]),

  // String functions
  new FuncDecl("S1Z3", ["string"]),
  new FuncDecl("C0NTA1NS", ["string", "substring"]),
  new FuncDecl("SUBT3XT", ["string", "start_index", "end_index"]),
  new FuncDecl("SPL1T", ["string"]),
  new FuncDecl("MAK3_UPP3R", ["string"]),
  new FuncDecl("MAK3_LOW3R", ["string"]),
];

/* eslint-disable no-param-reassign */
standardFunctions.forEach((f) => {
  f.builtin = true;
});
/* eslint-enable no-param-reassign */

module.exports = { standardFunctions };
