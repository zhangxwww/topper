import { typeRegs } from './type.js'

const tokens = []

function parse(input, errorHandler) {
  tokens.splice(0, tokens.length)
  while (input.length > 0) {
    let match = false
    for (let tr of typeRegs) {
      ({success, output, token} = tr.tryMatch(input))
      if (success) {
        input = output
        tokens.push(token)
        match = true
      }
    }
    if (!match) {
      errorHandler(input)
      return false
    }
  }
  return true
}

function next() {
  return tokens.splice(0, 1)
}

export { parse, next }
