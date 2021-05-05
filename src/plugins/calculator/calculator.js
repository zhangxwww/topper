import lexer from './lexer.js'

export default {
    match (q) {
        const pattern = /[0-9\w*+-/^()=]+/
        return q.search(pattern) >= 0
    },
    query (q, callback) {
        console.log(q)
        lexer.parse(q, error => {
            console.log('error', error)
        })
        const res = []
        while(lexer.hasNext()) {
            res.push(lexer.next())
        }
        callback(res)
        console.log(res)
    }
}