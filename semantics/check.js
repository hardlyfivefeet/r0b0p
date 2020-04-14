const util = require("util");
const { BoolLit } = require("../ast");

const R0B0P_TRUE = "b1p";
const R0B0P_FALSE = "b0p";

function doCheck(condition, message) {
  if (!condition) {
    // console.log("the message from the error is " + message);
    throw new Error(message);
  }
}

function doWarn(condition, message) {
  if (!condition) {
    console.warn(message);
  }
}

module.exports = {
  isNotReadOnly(id) {
    doCheck(id !== id.toUpperCase(), `Assignment to read-only variable`);
  },

  fieldHasNotBeenUsed(field, usedFields) {
    doCheck(!usedFields.has(field), `Field ${field} already declared`);
  },

  inLoop(context) {
    doCheck(
      context.inLoop,
      `Trying to use a loop-only statement outside of a loop (i.e. C0NT1NU3 or D1SC0NT1NU3)`
    );
  },

  inFunction(context) {
    doCheck(
      context.currentFunction,
      `Trying to use a function-only statement outside of a function (i.e. return)`
    );
  },

  isParam(id, params) {
    let isParam = false;
    params.forEach((param) => {
      if (id === param.name) {
        isParam = true;
      }
    });
    doCheck(
      isParam,
      `Trying to call a function, but it doesn't exist and is not a parameter.`
    );
  },

  // potentialInfiniteLoop(condition) {
  //   doWarn(
  //     !(condition.constructor === BoolLit && condition.value === R0B0P_TRUE),
  //     `Potential infinite loop.`
  //   );
  // },

  unreachableCodeWithCondition(condition) {
    doWarn(
      !(condition.constructor === BoolLit && condition.value === R0B0P_FALSE),
      `Unreachable code.`
    );
  },

  // Same number of args and params
  legalArguments(args, params) {
    doCheck(
      args.length === params.length,
      `Expected ${params.length} args in call, got ${args.length}`
    );
  },
};
