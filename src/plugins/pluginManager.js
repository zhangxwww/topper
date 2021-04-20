import defaultPlugin from './default/default.js'

const plugins = [defaultPlugin]

export default function query (q) {
  for (let p of plugins) {
    if (p.match(q)) {
      return p.query(q)
    }
  }
}
