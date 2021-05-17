import lexer from './lexer.js'
import parser from './parser.js'

export default {
    match (q) {
        const pattern = /[0-9\w*+-/^()=]+/
        return q.search(pattern) >= 0
    },
    query (q, callback) {
        let success = true, msg = ''
        lexer.parse(q, error => {
            console.log('Error Lexer', error)
            success = false
            msg = error
        })
        const res = parser.parse(lexer.lookAhead, lexer.next, lexer.hasNext, error => {
            console.log('Error Parser: ', error)
            success = false
            msg = error
        })

        success ? callback([res]) : callback([msg])
    }
}