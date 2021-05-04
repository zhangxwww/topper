export default {
    match (q) {
        const pattern = /[0-9\w*+-/^()=]+/
        return q.search(pattern) >= 0
    },
    query (q, callback) {
        console.log(q)
        q === '' ? callback([]): callback(['calc'])
    }
}