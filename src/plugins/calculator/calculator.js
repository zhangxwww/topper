import lexer from './lexer.js'
import parser from './parser.js'

export default {
    match (q) {
        const pattern = /[0-9\w*+-/^()=]+/
        return q.search(pattern) >= 0
    },
    query (q, callback) {
        lexer.parse(q, error => {
            console.log('Error Lexer', error)
        })
        const res = parser.parse(lexer.lookAhead, lexer.next, lexer.hasNext, e => {
            console.log('Error Parser: ', e)
        })

        callback([res])
        console.log(res)
    }
}