const util = require('util');
const parse = require('./ast/parser');

const program = String.raw`PR3SUM1NG[x < 5] < >`;
console.log(util.inspect(parse(program), {depth: null}));

