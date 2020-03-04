const util = require("util");
const parse = require("./ast/parser");

// const program = String.raw`SP3AK["Hello, world"];`;
// const program = String.raw`PR3SUM1NG[x < 5] < >`;
const program = String.raw`z = (-16.4 * 32) ** 8;`;

console.log(util.inspect(parse(program), { depth: null }));
