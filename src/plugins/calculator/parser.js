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
      return { success: false, value: null }
  }
}

function parseAssignment() {
  // ASSIGNMENT := set variable eq EXPRESSION
  let success, value

  ({success} = matchToken(types.SET))
  if (!success) {
    return {success: false, value: null}
  }

  ({success, value} = matchToken(types.VARIABLE))
  if (!success) {
    return {success: false, value: null}
  }
  const k = value

  ({success} = matchToken(types.EQ))
  if (!success) {
    return {success: false, value: null}
  }

  ({success, value} = parseExpression())
  if (!success) {
    return {success: false, value: null}
  }
  const v = value

  variables[k] = v
  return {success: true, value: v}
}

function parseQuery() {
  // QUERY := get QQ
  let success
  ({success} = matchToken(types.GET))
  if (!success) {
    return {success: false, value: null}
  }
  return parseQQ()
}

function parseQQ() {
  // QQ := variable | ans
  let success, value
  switch (ahead.type) {
    case types.VARIABLE:
      ({success, value} = matchToken(types.VARIABLE))
      if (!success) {
        return {success: false, value: null}
      }
      const k = value
      return { success: true, value: (variables[k] === undefined ? 'undefined' : variables[k]) }
    case types.ANS:
      ({success} = matchToken(types.ANS))
      if (!success) {
        return {success: false, value: null}
      }
      return { success: true, value: ans }
    default:
      errorHandler(ahead)
      return {success: false, value: null}
  }
}

function parseExpression() {

}

function matchToken(expected) {
  if (ahead.type !== expected) {
    errorHandler(ahead)
    return { success: false, value: null }
  } else {
    ahead = next()
    return { success: true, value: ahead.value }
  }
}

export default { parse }
