const util = require("util");
const parse = require("./ast/parser");

// const program = String.raw`SP3AK["Hello, world"];`;
// const program = String.raw`PR3SUM1NG[x < 5] < >`;
const program = String.raw`y = {a: 1, b: 2};`;

console.log(util.inspect(parse(program), { depth: null }));
