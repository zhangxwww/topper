import defaultPlugin from './default/default.js'

const plugins = [defaultPlugin]

export default function query (q, callback) {
  for (let p of plugins) {
    if (p.match(q)) {
      p.query(q, callback)
    }
  }
}
