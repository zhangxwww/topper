import { types, typeRegs } from './type.js'

function tryMatchGenerator(type_, reg) {
  const tm = (input) => {
    const match = input.match(reg)
    const success = input.length > 0 && match !== null
    let output = null, token = null
    if (success) {
      const m = match[0]
      console.log(match)
      output = input.slice(m.length)
      if (type_ === types.NUMBER) {
        token = { type: type_, value: parseFloat(m) }
      } else {
        token = { type: type_, value: m }
      }
    }
    return { success: success, output: output, token: token }
  }
  return tm
}

for (let tr of typeRegs) {
  tr.tryMatch = tryMatchGenerator(tr.type, tr.reg)
}


const tokens = []

function parse(input, errorHandler) {
  tokens.splice(0, tokens.length)
  while (input.length > 0) {
    let match = false
    let success, output, token
    console.log(input)
    for (let tr of typeRegs) {
      ({success, output, token} = tr.tryMatch(input))
      if (success) {
        input = output
        match = true
        if (token.type !== types.SPACE) {
          tokens.push(token)
        }
        break
      }
    }
    if (!match) {
      errorHandler(input)
      return false
    }
  }
  tokens.push({ type: types.END, value: '#' })
  return true
}

function next() {
  return tokens.splice(0, 1)
}

function lookAhead() {
  return tokens[0]
}

function hasNext() {
    return tokens.length > 0
}

export default { parse, next, lookAhead, hasNext }
