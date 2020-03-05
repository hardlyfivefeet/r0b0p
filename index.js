const fs = require("fs");
const util = require("util");
const yargs = require("yargs");
const parse = require("./ast/parser");

// If compiling from a string, return the AST, IR, or compiled code as a string.
function compile(sourceCode) {
  let program = parse(sourceCode);
  return util.inspect(program, { depth: null });
}

// If compiling from a file, write to standard output.
function compileFile(filename, options) {
  fs.readFile(filename, "utf-8", (error, sourceCode) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(compile(sourceCode, options));
  });
}

// Two nice functions if you'd like to embed a compiler in your own apps.
module.exports = { compile, compileFile };

// Run the compiler as a command line application.
if (require.main === module) {
  const { argv } = yargs
    .usage("$0 [-a] filename")
    .boolean(["a"])
    .describe("a", "show abstract syntax tree after parsing then stop")
    .demand(1);
  compileFile(argv._[0], {
    astOnly: argv.a
  });
}
