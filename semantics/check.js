const { BoolLit } = require("../ast");

const R0B0P_FALSE = "b0p";

function doCheck(condition, message) {
  if (!condition) {
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
    doCheck(
      id !== id.toUpperCase(),
      `Beep! That variable is read-only. Cannot be assigned.`
    );
  },

  fieldAlreadyDeclared(field, usedFields) {
    doCheck(
      !usedFields.has(field),
      `Bop! The field ${field} has already been declared. Please reconsider, human.`
    );
  },

  inLoop(context) {
    doCheck(
      context.inLoop,
      `Bop beep... Human is trying to use a loop-only statement outside of a loop (such as C0NT1NU3 or D1SC0NT1NU3).`
    );
  },

  inFunction(context) {
    doCheck(
      context.currentFunction,
      `Boooop! Human is trying to use a function-only statement outside of a function (i.e. G1V3).`
    );
  },

  isParam(id, params) {
    let isParam = false;
    params.forEach((param) => {
      if (id === param.name) {
        isParam = true;
      }
    });
    doCheck(isParam, `Beep bop. That function doesn't exist as a parameter.`);
  },

  potentialInfiniteLoop(context) {
    doWarn(
      !(context.inLoop && context.potentialInfiniteLoop && !context.seenBreak),
      `Bip bop. Detecting a potential infinite loop. Be cautious.`
    );
  },

  unreachableCodeWithCondition(condition) {
    doWarn(
      !(condition.constructor === BoolLit && condition.value === R0B0P_FALSE),
      `Boop. This code is unreachable, human. Please remove it.`
    );
  },

  unreachableCodeAfterBreakOrReturn(condition) {
    doWarn(
      !condition,
      `Boop. This code is unreachable, human. Please remove it.`
    );
  },

  // Same number of args and params
  legalArguments(args, params) {
    doCheck(
      args.length === params.length,
      `Bip beep. Expected ${params.length} arguments in call, but got ${args.length}.`
    );
  },

  assigningVarToFunc(context, id) {
    const lookupFuncResult = context.lookupFunctionByName(id);
    doCheck(
      !lookupFuncResult,
      `Beeep! Human is trying to override a function with a variable. That is not allowed.`
    );
  },

  assigningFuncToVar(context, id) {
    if (!context.lookup(id)) {
      return;
    }
    throw new Error(
      `Bip beeep! Human is trying to override a variable with a function. That is not allowed.`
    );
  },

  unusedLocals(context) {
    context.locals.forEach((local) => {
      doWarn(
        local.referenced,
        `Beep! Alert! Detecting unused variable ${local.name}`
      );
    });
  },
};
