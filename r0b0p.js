const util = require("util");
const parse = require("./ast/parser");

// const program = String.raw`SP3AK["Hello, world"];`;
// const program = String.raw`PR3SUM1NG[x < 5] < >`;
const program = String.raw`x_is_even = b0p; C0UNT[x:0->5] < x_is_even = N0T x_is_even; >`;

console.log(util.inspect(parse(program), { depth: null }));
