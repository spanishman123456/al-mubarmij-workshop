/**
 * تتبع النطاق scope — أمثلة تعليمية بسيطة
 * @typedef {{ locals: Record<string, unknown>, globals: Record<string, unknown> }} ScopeState
 */

/** @param {ScopeState} state @param {string} name */
export function readVariable(state, name) {
  if (Object.prototype.hasOwnProperty.call(state.locals, name)) {
    return { value: state.locals[name], scope: "local" };
  }
  if (Object.prototype.hasOwnProperty.call(state.globals, name)) {
    return { value: state.globals[name], scope: "global" };
  }
  return { value: undefined, scope: "undefined" };
}

/** @param {ScopeState} state @param {string} name @param {unknown} value @param {'local'|'global'} where */
export function assignVariable(state, name, value, where = "local") {
  const next = {
    locals: { ...state.locals },
    globals: { ...state.globals },
  };
  if (where === "global") next.globals[name] = value;
  else next.locals[name] = value;
  return next;
}

/** @param {ScopeState} state */
export function enterFunctionScope(state) {
  return { locals: {}, globals: { ...state.globals, ...state.locals } };
}

/** سيناريوهات جاهزة للمختبر */
export const SCOPE_SCENARIOS = [
  {
    id: "local-shadow",
    codeAr: "x = 10\ndef f():\n    x = 3\n    print(x)\nf()",
    questionAr: "ما الذي تطبعه f()؟",
    answer: "3",
    explainAr: "x داخل الدالة متغير محلي يحجب x العام.",
  },
  {
    id: "global-read",
    codeAr: "score = 5\ndef show():\n    print(score)\nshow()",
    questionAr: "ما الذي تطبعه show()؟",
    answer: "5",
    explainAr: "score غير معرّف محليًا فتُقرأ القيمة العامة.",
  },
  {
    id: "param-local",
    codeAr: "def greet(name):\n    msg = 'Hi ' + name\n    print(msg)\ngreet('Ali')",
    questionAr: "ما msg عند greet('Ali')؟",
    answer: "Hi Ali",
    explainAr: "name و msg محليان داخل greet.",
  },
];
