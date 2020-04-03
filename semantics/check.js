const util = require("util");
const {
  List,
  Dict,
  IntLit,
  FloatLit,
  Text,
  FuncDecl,
  BoolLit
} = require("../ast");

function doCheck(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

module.exports = {
  // Is this type an list type?
  isListType(type) {
    doCheck(type.constructor === List, "Not a list type");
  },

  isDictType(type) {
    doCheck(type.constructor === Dict, "Not a dict type");
  },

  isList(expression) {
    doCheck(expression.type.constructor === List, "Not a list");
  },

  isDict(expression) {
    doCheck(expression.type.constructor === Dict, "Not a dict");
  },

  isPrimitiveOrString(expression) {
    doCheck(
      expression.type === (IntLit || FloatLit || BoolLit || Text),
      "not a primitive or string"
    );
  },

  isNumber(expression) {
    doCheck(expression.type === (IntLit || FloatLit), "Not a number");
  },

  isInteger(expression) {
    doCheck(expression.type === IntLit, "Not an integer");
  },

  isFloat(expression) {
    doCheck(expression.type === FloatLit, "Not a float");
  },

  isText(expression) {
    doCheck(expression.type === Text, "Not text!");
  },

  isNumberOrBool(expression) {
    doCheck(
      expression.type === (IntLit || FloatLit || BoolLit),
      "Not a number or boolean"
    );
  },

  isFunction(value) {
    doCheck(value.constructor === FuncDecl, "Not a function");
  },

  // Are two types exactly the same?
  expressionsHaveTheSameType(e1, e2) {
    doCheck(e1.type === e2.type, "Types must match exactly");
  },

  isNotReadOnly(id) {
    doCheck(id !== id.toUpperCase(), `Assignment to read-only variable`);
  },

  fieldHasNotBeenUsed(field, usedFields) {
    doCheck(!usedFields.has(field), `Field ${field} already declared`);
  },

  // inLoop(context, keyword) {
  //   doCheck(context.inLoop, `${keyword} can only be used in a loop`);
  // },

  // Same number of args and params; all types compatible
  legalArguments(args, params) {
    doCheck(
      args.length === params.length,
      `Expected ${params.length} args in call, got ${args.length}`
    );
    args.forEach((arg, i) => this.isAssignableTo(arg, params[i].type));
  }
};
