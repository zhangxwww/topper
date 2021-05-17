import { types } from './type.js'

let lookAhead, next, hasNext, errorHandler;

let variables = { }
let ans = 0

let ahead

function parse(lookAhead_, next_, hasNext_, errorHandler_) {
  lookAhead = lookAhead_
  next = next_
  hasNext = hasNext_
  errorHandler = errorHandler_
  ahead = lookAhead()
  const res = parseStart()
  if (ahead.type === types.END) {
    return res
  } else {
    unexpectedToken(ahead)
    return 0
  }
}

function parseStart() {
  // START := ASSIGNMENT | QUERY | EXPRESSION
  console.log('start')
  console.log(variables)
  switch (ahead.type) {
    case types.SET:
      return parseAssignment()
    case types.GET:
      return parseQuery()
    case types.LB:
    case types.MINUS:
    case types.VARIABLE:
    case types.NUMBER:
    case types.E:
    case types.PI:
    case types.ANS:
    case types.LG:
    case types.LOG:
    case types.LN:
      ({value: ans} = parseExpression())
      return ans
    default:
      unexpectedToken(ahead)
      return fail()
  }
}

function parseAssignment() {
  // ASSIGNMENT := set variable eq EXPRESSION
  console.log('assignment')
  let success, value

  ({success} = matchToken(types.SET))
  if (!success) {
    return fail()
  }

  ({success, value} = matchToken(types.VARIABLE))
  if (!success) {
    return fail()
  }
  const k = value;

  ({success} = matchToken(types.EQ))
  if (!success) {
    return fail()
  }

  ({success, value} = parseExpression())
  if (!success) {
    return fail()
  }
  const v = value

  variables[k] = v
  console.log(variables)
  return suc(v)
}

function parseQuery() {
  // QUERY := get QQ
  console.log('query')
  console.log(variables)
  let success
  ({success} = matchToken(types.GET))
  if (!success) {
    return fail()
  }
  return parseQQ()
}

function parseQQ() {
  // QQ := variable | ans
  console.log('qq')
  let value
  let k
  switch (ahead.type) {
    case types.VARIABLE:
      ({value} = matchToken(types.VARIABLE))
      k = value
      return suc(variables[k] === undefined ? 'undefined' : variables[k])
    case types.ANS:
      matchToken(types.ANS)
      return suc(ans)
    default:
      unexpectedToken(ahead)
      return fail()
  }
}

function parseExpression() {
  // EXPRESSION := T EE
  console.log('expression')
  let success, value
  ({success, value} = parseT())
  if (!success) {
    return fail()
  }
  const v1 = value;

  ({success, value} = parseEE())
  if (!success) {
    return fail()
  }
  const v2 = value
  return suc(v1 + v2)
}

function parseEE() {
  // EE := + T EE | - T EE | epsilon
  console.log('ee', ahead.type, ahead.value)
  let success, value
  let v1, v2, v3, v4
  switch (ahead.type) {
    case types.PLUS:
      matchToken(types.PLUS);

      ({success, value} = parseT())
      if (!success) {
        return fail()
      }
      v1 = value;

      ({success, value} = parseEE())
      if (!success) {
        return fail()
      }
      v2 = value

      return suc(v1 + v2)
    case types.MINUS:
      matchToken(types.MINUS);

      ({success, value} = parseT())
      if (!success) {
        return fail()
      }
      v3 = value;

      ({success, value} = parseEE())
      if (!success) {
        return fail()
      }
      v4 = value

      return suc(-v3 + v4)

    case types.RB:
    case types.END:
      return suc(0)
    default:
      return fail()
  }
}

function parseT() {
  // T := F TT
  console.log('t')
  let success, value
  ({success, value} = parseF())
  if (!success) {
    return fail()
  }
  const v1 = value;

  ({success, value} = parseTT())
  if (!success) {
    return fail()
  }
  const v2 = value
  return suc(v1 * v2)
}

function parseTT() {
  // TT := * F TT | / F TT | epsilon
  console.log('tt', ahead.type, ahead.value)
  let success, value
  let v1, v2, v3, v4
  switch (ahead.type) {
    case types.TIMES:
      matchToken(types.TIMES);

      ({success, value} = parseF())
      if (!success) {
        return fail()
      }
      v1 = value;

      ({success, value} = parseTT())
      if (!success) {
        return fail()
      }
      v2 = value

      return suc(v1 * v2)
    case types.DIVISION:
      matchToken(types.DIVISION);

      ({success, value} = parseF())
      if (!success) {
        return fail()
      }
      v3 = value;

      ({success, value} = parseTT())
      if (!success) {
        return fail()
      }
      v4 = value

      return suc(1 / v3 * v4)

    case types.PLUS:
    case types.MINUS:
    case types.RB:
    case types.END:
      return suc(1)
    default:
      return fail()
  }
}

function parseF() {
  // F := P FF | L
  console.log('f')

  let success, value
  let v1, v2

  switch (ahead.type) {
    case types.LB:
    case types.MINUS:
    case types.VARIABLE:
    case types.NUMBER:
    case types.E:
    case types.PI:
    case types.ANS:
      ({success, value} = parseP())
      if (!success) {
        fail()
      }
      v1 = value;

      ({success, value} = parseFF())
      if (!success) {
        fail()
      }
      v2 = value

      return suc(Math.pow(v1, v2))

    case types.LOG:
    case types.LN:
    case types.LG:
      return parseL()

    default:
      unexpectedToken(ahead)
      return fail()
  }
}

function parseL() {
  // L := log P | ln P | lg P
  console.log('l')
  let success, value
  let v1, v2, v3

  switch (ahead.type) {
    case types.LOG:
      matchToken(types.LOG);
      ({success, value} = parseP())
      if (!success) {
        return fail()
      }
      v1 = value

      return suc(Math.log2(v1))

    case types.LN:
      matchToken(types.LN);
      ({success, value} = parseP())
      if (!success) {
        return fail()
      }
      v2 = value

      return suc(Math.log(v2))

    case types.LG:
      matchToken(types.LG);
      ({success, value} = parseP())
      if (!success) {
        return fail()
      }
      v3 = value

      return suc(Math.log10(v3))

    default:
      unexpectedToken(ahead)
      return fail()
  }
}

function parseFF() {
  // FF := ^ P FF | epsilon
  console.log('ff')
  let success, value
  let v1, v2
  switch (ahead.type) {
    case types.POWER:
      matchToken(types.POWER);
      ({success, value} = parseP())
      if (!success) {
        return fail()
      }
      v1 = value;

      ({success, value} = parseFF())
      if (!success) {
        return fail()
      }
      v2 = value

      return suc(Math.pow(v1, v2))

    case types.PLUS:
    case types.MINUS:
    case types.TIMES:
    case types.DIVISION:
    case types.RB:
    case types.END:
      return suc(1)
    default:
      return fail()
  }
}

function parseP() {
  // P := ( E ) | i
  console.log('p')
  let success, value
  let v
  switch (ahead.type) {
    case types.LB:
      matchToken(types.LB);

      ({success, value} = parseExpression())
      if (!success) {
        return fail()
      }
      v = value;

      ({success} = matchToken(types.RB))
      if (!success) {
        return fail()
      }

      return suc(v)

    case types.MINUS:
    case types.VARIABLE:
    case types.NUMBER:
    case types.E:
    case types.PI:
    case types.ANS:
      return parseI()

    default:
      unexpectedToken(ahead)
      return fail()
  }
}

function parseI() {
  // I := J | - J
  console.log('i')
  let success, value
  let v

  switch (ahead.type) {
    case types.VARIABLE:
    case types.NUMBER:
    case types.E:
    case types.PI:
    case types.ANS:
      return parseJ()

    case types.MINUS:
      matchToken(types.MINUS);

      ({success, value} = parseJ())
      if (!success) {
        return fail()
      }
      v = value
      return suc(-v)

    default:
      unexpectedToken(ahead)
      return fail()
  }
}

function parseJ() {
  // J := variable | number | e | pi | ans
  console.log('j')
  console.log(ahead)
  let k, value
  switch (ahead.type) {
    case types.VARIABLE:
      ({value} = matchToken(types.VARIABLE))
      k = value
      return variables[k] !== undefined ? suc(variables[k]) : fail()
    case types.NUMBER:
      return matchToken(types.NUMBER)
    case types.E:
      matchToken(types.E)
      return suc(Math.E)
    case types.PI:
      matchToken(types.PI)
      return suc(Math.PI)
    case types.ANS:
      matchToken(types.ANS)
      return suc(ans)
    default:
      unexpectedToken(ahead)
      return fail()
  }
}

function matchToken(expected) {
  console.log('match ', expected)
  if (ahead.type !== expected) {
    unexpectedToken(ahead)
    return fail()
  } else {
    if (!hasNext()) {
      return fail()
    }
    const value = ahead.value
    next()
    ahead = lookAhead()
    console.log('ahead: ', ahead.type, ahead.value)
    return suc(value)
  }
}

function fail() {
  return { success: false, value: null }
}

function suc(value) {
  console.log(value)
  return { success: true, value: value }
}

function unexpectedToken(token) {
  const msg = 'Unexpected token: ' + token.value
  errorHandler(msg)
}

export default { parse }
