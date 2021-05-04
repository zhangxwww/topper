const types = {
  VARIABLE: 0,
  NUMBER: 1,
  PLUS: 2,
  MINUS: 3,
  TIMES: 4,
  DIVISION: 5,
  POWER: 6,
  LOG: 7,
  LG: 8,
  LN: 9,
  E: 10,
  PI: 11,
  LB: 12,
  RB: 13,
  EQ: 14,
  RES: 15,
  QES: 16,
  SPACE: 17
}

function tryMatchGenerator(type_, reg) {
  const tm = (input) => {
    const match = input.match(reg)
    const success = match !== null
    let output = null, token = null
    if (success) {
    const m = match[0]
    output = input.slice(m.length)
    if (type_ === type.NUMBER) {
      token = { type: type_, value: parseFloat(m) }
    } else {
      token = { type: type_, value: m }
    }
    }
    return { success: success, output: output, token: token }
  }
  return tm
}

const typeRegs = [
  {
    type: types.VARIABLE,
    reg: /^[A-Z]/
  },
  {
    type: types.NUMBER,
    reg: /^[0-9]+(.[0-9]+)?/
  },
  {
    type: types.PLUS,
    reg: /^\+/
  },
  {
    type: types.MINUS,
    reg: /^-/
  },
  {
    type: types.TIMES,
    reg: /^\*/
  },
  {
    type: types.DIVISION,
    reg: /^\//
  },
  {
    type: types.POWER,
    reg: /^\^/
  },
  {
    type: types.LOG,
    reg: /^log/
  },
  {
    type: types.LG,
    reg: /^lg/
  },
  {
    type: types.LN,
    reg: /^ln/
  },
  {
    type: types.E,
    reg: /^e/
  },
  {
    type: types.PI,
    reg: /^pi/
  },
  {
    type: types.LB,
    reg: /^\(/
  },
  {
    type: types.RB,
    reg: /^\)/
  },
  {
    type: types.EQ,
    reg: /^=/
  },
  {
    type: types.RES,
    reg: /^res/
  },
  {
    type: types.QES,
    reg: /^\?/
  },
  {
    type: types.SPACE,
    reg: /^\s+/
  }
]

for (let tr of typeRegs) {
  tr.tryMatch = tryMatchGenerator(tr.type, tr.reg)
}

export { types, typeRegs }
