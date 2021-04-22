export default {
    match (q) {
        console.log(q)
        return true
    },
    query (q, callback) {
        console.log(q)
        q === '' ? callback([]): callback(['Nothing Found','Nothing Found','Nothing Found','Nothing Found','Nothing Found','Nothing Found','Nothing Found','Nothing Found'])
    }
}