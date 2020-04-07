const util = require("util");
const {
  List,
  Dict,
  IntLit,
  FloatLit,
  Text,
  FuncDecl,
  BoolLit,
} = require("../ast");

function doCheck(condition, message) {
  if (!condition) {
    console.log("uh oh error ", message);
    throw new Error(message);
  }
}

module.exports = {
  //need to work on our checks !
  isList(expression) {
    doCheck(expression.constructor === List, "Not a list");
  },

  isDict(expression) {
    doCheck(expression.constructor === Dict, "Not a dict");
  },

  isPrimitiveOrString(expression) {
    doCheck(
      expression.constructor === (IntLit || FloatLit || BoolLit || Text) ||
        expression.value.constructor ===
          (IntLit || FloatLit || BoolLit || Text),
      "not a primitive or string"
    );
  },

  isNumber(expression) {
    doCheck(expression.constructor === (IntLit || FloatLit), "Not a number");
  },

  isInteger(expression) {
    doCheck(expression.constructor === IntLit, "Not an integer");
  },

  isFloat(expression) {
    doCheck(expression.constructor === FloatLit, "Not a float");
  },

  isText(expression) {
    doCheck(expression.constructor === Text, "Not text!");
  },

  isNumberOrBool(expression) {
    doCheck(
      expression.constructor === (IntLit || FloatLit || BoolLit),
      "Not a number or boolean"
    );
  },

  isFunction(id) {
    doCheck(id.constructor === FuncDecl, "Not a function");
  },

  isNotReadOnly(id) {
    doCheck(id !== id.toUpperCase(), `Assignment to read-only variable`);
  },

  fieldHasNotBeenUsed(field, usedFields) {
    doCheck(!usedFields.has(field), `Field ${field} already declared`);
  },

  // Same number of args and params
  legalArguments(args, params) {
    // console.log("args is ", args);
    // console.log("params is ", params);
    doCheck(
      args.length === params.length,
      `Expected ${params.length} args in call, got ${args.length}`
    );
  },
};
