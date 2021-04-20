export default {
    match (q) {
        console.log(q)
        return true
    },
    query (q) {
        console.log(q)
        return ['Nothing Found']
    }
}