import defaultPlugin from './default/default.js'
import dictionaryPlugin from './dictionary/dictionary.js'

const plugins = [dictionaryPlugin, defaultPlugin]

export default function query (q, callback) {
  q = q.trim()
  for (let p of plugins) {
    if (p.match(q)) {
      p.query(q, callback)
      break
    }
  }
}
