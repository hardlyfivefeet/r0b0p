const util = require("util");
const {} = require("../ast");

function doCheck(condition, message) {
  // console.log("the message from the error is " + message);
  if (!condition) {
    throw new Error(message);
  }
}

module.exports = {
  isNotReadOnly(id) {
    doCheck(id !== id.toUpperCase(), `Assignment to read-only variable`);
  },

  fieldHasNotBeenUsed(field, usedFields) {
    doCheck(!usedFields.has(field), `Field ${field} already declared`);
  },

  // Same number of args and params
  legalArguments(args, params) {
    doCheck(
      args.length === params.length,
      `Expected ${params.length} args in call, got ${args.length}`
    );
  },
};
