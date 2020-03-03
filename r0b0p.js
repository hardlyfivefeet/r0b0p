const util = require('util');
const parse = require('./ast/parser');

// const program = String.raw`SP3AK["Hello, world"];`;
const program2 = String.raw`PR3SUM1NG[x < 5] < >`;

console.log(util.inspect(parse(program2), {depth: null}));

