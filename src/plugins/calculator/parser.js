import { types } from './type.js'

let lookAhead, next, errorHandler;

let variables = { }
let ans = 0

let ahead

function parse(lookAhead_, next_, errorHandler_) {
  lookAhead = lookAhead_
  next = next_
  errorHandler = errorHandler_
  variables = {}
  ahead = lookAhead()
  return parseStart()
}

function parseStart() {
  // START := ASSIGNMENT | QUERY | EXPRESSION
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
      return parseExpression()
    default:
      errorHandler(ahead)
      return fail()
  }
}

function parseAssignment() {
  // ASSIGNMENT := set variable eq EXPRESSION
  let success, value

  ({success} = matchToken(types.SET))
  if (!success) {
    return fail()
  }

  ({success, value} = matchToken(types.VARIABLE))
  if (!success) {
    return fail()
  }
  const k = value

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
  return suc(v)
}

function parseQuery() {
  // QUERY := get QQ
  let success
  ({success} = matchToken(types.GET))
  if (!success) {
    return fail()
  }
  return parseQQ()
}

function parseQQ() {
  // QQ := variable | ans
  let success, value
  switch (ahead.type) {
    case types.VARIABLE:
      ({value} = matchToken(types.VARIABLE))
      const k = value
      return suc(variables[k] === undefined ? 'undefined' : variables[k])
    case types.ANS:
      matchToken(types.ANS)
      return suc(ans)
    default:
      errorHandler(ahead)
      return fail()
  }
}

function parseExpression() {
  // EXPRESSION := T EE
  let success, value
  ({success, value} = parseT())
  if (!success) {
    return fail()
  }
  const v1 = value

  ({success, value} = parseEE())
  if (!success) {
    return fail()
  }
  const v2 = value
  return suc(v1 + v2)
}

function parseEE() {
  // EE := + T EE | - T EE | epsilon
  let success, value
  switch (ahead.type) {
    case types.PLUS:
      matchToken(type.PLUS)

      ({success, value} = parseT())
      if (!success) {
        return fail()
      }
      const v1 = value

      ({success, value} = parseEE())
      if (!success) {
        return fail()
      }
      const v2 = value

      return suc(v1 + v2)
    case types.MINUS:
      matchToken(types.MINUS)

      ({success, value} = parseT())
      if (!success) {
        return fail()
      }
      const v1 = value

      ({success, value} = parseEE())
      if (!success) {
        return fail()
      }
      const v2 = value

      return suc(-v1 + v2)
    default:
      return suc(0)
  }
}

function parseT() {
  // T := F TT
  let success, value
  ({success, value} = parseF())
  if (!success) {
    return fail()
  }
  const v1 = value

  ({success, value} = parseTT())
  if (!success) {
    return fail()
  }
  const v2 = value
  return suc(v1 * v2)
}

function parseTT() {
  // TT := * F TT | / F TT | epsilon
  let success, value
  switch (ahead.type) {
    case types.TIMES:
      matchToken(type.TIMES)

      ({success, value} = parseF())
      if (!success) {
        return fail()
      }
      const v1 = value

      ({success, value} = parseTT())
      if (!success) {
        return fail()
      }
      const v2 = value

      return suc(v1 * v2)
    case types.DIVISION:
      matchToken(types.DIVISION)

      ({success, value} = parseF())
      if (!success) {
        return fail()
      }
      const v1 = value

      ({success, value} = parseTT())
      if (!success) {
        return fail()
      }
      const v2 = value

      return suc(1 / v1 * v2)
    default:
      return suc(1)
  }
}

function parseF() {
  // F := P FF | L
  let success, value

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
      const v1 = value

      ({success, value} = parseFF())
      if (!success) {
        fail()
      }
      const v2 = value

      return suc(Math.pow(v1, v2))

    case types.LOG:
    case types.LN:
    case types.LG:
      return parseL()

    default:
      errorHandler(ahead)
      return fail()
  }
}

function parseL() {
  // L := log P | ln P | lg P
  let success, value

  switch (ahead.type) {
    case types.LOG:
      matchToken(types.LOG)
      ({success, value} = parseP())
      if (!success) {
        return fail()
      }
      const v1 = value

      return suc(Math.log2(v1))

    case types.LN:
      matchToken(types.LN)
      ({success, value} = parseP())
      if (!success) {
        return fail()
      }
      const v1 = value

      return suc(Math.log(v1))

    case types.LG:
      matchToken(types.LG)
      ({success, value} = parseP())
      if (!success) {
        return fail()
      }
      const v1 = value

      return suc(Math.log10(v1))

    default:
      errorHandler(ahead)
      return fail()
  }
}

function parseFF() {
  // FF := ^ P FF | epsilon
  let success, value
  switch (ahead.type) {
    case types.POWER:
      matchToken(types.POWER)
      ({success, value} = parseP())
      if (!success) {
        return fail()
      }
      const v1 = value

      ({success, value} = parseFF())
      if (!success) {
        return fail()
      }
      const v2 = value

      return suc(Math.pow(v1, v2))
    default:
      return suc(1)
  }
}

function parseP() {
  // P := ( E ) | i
  let success, value
  switch (ahead.type) {
    case types.LB:
      matchToken(types.LB)

      ({success, value} = parseE())
      if (!success) {
        return fail()
      }
      const v = value

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
      errorHandler(ahead)
      return fail()
  }
}

function parseI() {
  // I := J | - J
  let success, value

  switch (ahead.type) {
    case types.VARIABLE:
    case types.NUMBER:
    case types.E:
    case types.PI:
    case types.ANS:
      return parseJ()

    case types.MINUS:
      matchToken(type.MINUS)

      ({success, value} = parseJ())
      if (!success) {
        return fail()
      }
      const v = value
      return suc(-v)

    default:
      errorHandler(ahead)
      return fail()
  }
}

function parseJ() {
  // J := variable | number | e | pi | ans
  switch (ahead.type) {
    case types.VARIABLE:
    case types.NUMBER:
      return matchToken(ahead.type)
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
      errorHandler(ahead)
      return fail()
  }
}

function matchToken(expected) {
  if (ahead.type !== expected) {
    errorHandler(ahead)
    return fail()
  } else {
    ahead = next()
    return suc(ahead.value)
  }
}

function fail() {
  return { success: false, value: null }
}

function suc(value) {
  return { success: true, value: value }
}

export default { parse }
